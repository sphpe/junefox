import SockJS from "sockjs-client"

import Config from '../config'
const config = Config.sockets

import { getSid } from './session'
import logger from './logger'

class EM {

  constructor() {
    this.stack = {};
  }

  on = (event, cb) => {
    this.stack[event] = this.stack[event] || []
    return this.stack[event].push(cb);
  }

  emit = (event, data) => {
    if (this.stack[event]) {
      let callbacks = this.stack[event];
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i](data);
      }
    }
  }

  cancel = (event,cb) => {
    if (this.stack[event]) {
      let index = this.stack[event].indexOf(cb)
      if (index != -1) {
        this.stack[event].splice(index,1)
      }
    }
  }

  destroy = () => {
    this.stack = {}
  }
}

class Channel extends EM {
  
  constructor(cs, id, params) {
    super()
    this.cs = cs;
    this.id = id;
    this.params = params || {}
    this.subscribed = false;
  }

  subscribe = (force) => {
    if (!this.subscribed || force) {
      this.subscribed = true;
      this.cs.channels[this.id] = this;
      if (!this.params.local) {
        let msg = "2&&" + this.id;
        if (this.params.room) msg += "&&" + this.params.miniroom + "&&" + this.params.room;
        this.cs._send(msg);        
      }
    }
  }

  unsubscribe = () => {
    if (this.subscribed) {
      this.cs._send("3&&" + this.id);
      this.subscribed = false;
      delete this.cs.channels[this.id];
    }
  }
}

export default class Cloudsockets extends EM {

  constructor(uid,sid,connect) {
    super();
    this.channels = {};
    this.state = "initializing";
    this.errorDate = 0;
    this.fallback = false;
    this.ws = false;
    this.wsAttempts = 0;
    this.attempts = 0;
    if (uid) this.userChannel = this.subscribe("u-"+uid,{local: true});
    if (connect) this.connect()
  }

  connect = () => {
    if (this.state !== "initializing") return;
    this.pingInterval = setInterval(() => {
      if (this.state === "established") this._send("0");
    }, config.timeout.ping);
    this._connect();
  };

  destroy = () => {
    clearInterval(this.pingInterval);
    clearTimeout(this.pong_timeout); 
    clearTimeout(this.connect_timeout);   
    this.lastState = this.state;
    this.state = "destroyed";
    for (var cid in this.channels) {
      this.channels[cid].destroy()
    }
    this.channels = {};
    this.stack = {}
    try {
      this.socket.close()
    } catch (err) {
      logger.log("destroy err:",err)
    }
  }

  auth = () => {
    let sid = getSid()
    if (sid) {
      this._send("1&&" + sid);
    }
  };

  subscribe = (id, params) => {
    var channel = this.channels[id]
    if (!channel) {
      channel = this.channels[id] = new Channel(this, id, params);
    }
    channel.subscribe();
    return channel;
  };

  _send = (msg) => {
    try {
      if (this.state === "established") this.socket.send(msg);
    } catch (err) {
      console.log("socket send err",err)
    }
  };

  _update = (state, data) => {
    var cid;
    this.lastState = this.state;
    this.state = state;
    this.emit("state", state);
    if (this.state !== "established") {
      if (this.pong_timeout) {
        clearTimeout(this.pong_timeout);
      }
      for (cid in this.channels) {
        this.channels[cid].subscribed = false;
      }
    }
    if (this.state === "error") {
      if (this.lastState === "established") {
        this._update("closed", data);
      }
      if (this.state !== "reconnecting") {
        return this._reconnect(config.timeout.reconnect);
      }
    }
  };

  _resetPongTimeout = () => {
    if (this.pong_timeout) {
      clearTimeout(this.pong_timeout);
    }
    if (this.state === "established") {
      this.pong_timeout = setTimeout(() => {
        if (this.state === "established") {
          return this._update("error", "no messages from server");
        }
      }, config.timeout.pong);
    }
  };

  _connect = () => {
    this.attempts++;
    this._update("connecting");
    if (this.connect_timeout) {
      clearTimeout(this.connect_timeout);
    }
    this.connect_timeout = setTimeout(() => {
      if (this.state === 'connecting') {
        this.fallback = true;
        this.ws = false;
        return this._update("error", "connect timeout");
      }
    }, config.timeout.connect);
    if (!this.fallback) {
      this.wsAttempts++;
      if (this.wsAttempts > 2) {
        this.fallback = true;
        this.ws = false;
      }
    }
    var Socket = !this.fallback && window.WebSocket || window.MozWebSocket;
    if (!Socket) this.fallback = true;
    if (this.fallback) Socket = SockJS;
    
    if (location.protocol.indexOf("https") === 0) {
      this.protocol = this.fallback && "https://" || "wss://";
      this.port = config.wss_port;
    } else {
      this.protocol = this.fallback && "http://" || "ws://";
      this.port = config.ws_port;
    }
    this.host = config.hosts[Math.floor(Math.random() * config.hosts.length)];
    this.url = this.protocol + this.host + ":" + this.port + '/sockjs/';
    logger.log("socket connecting to ",this.url);
    this.socket = new Socket(this.url);
    this.socket.onopen = () => {
      if (!this.fallback) {
        this.ws = true;
      }
      logger.log("SockJS:",this.fallback)
      this._update("established");
      if (this.reconnect_timeout) clearTimeout(this.reconnect_timeout);
      if (this.connect_timeout) clearTimeout(this.connect_timeout);      
      this._resetPongTimeout();
      this.auth();
      for (let cid in this.channels) {
        this.channels[cid].subscribe(true);
      }
    };

    this.socket.onmessage = (message) => {
      this._resetPongTimeout();
      let msg = message.data.split("&&");
      let mid = msg.shift();
      if (mid === "0" && msg.length > 0) {
        let channel = msg[0], 
            event = msg[1], 
            date = msg[2];
        var data = msg[3]
        try {
          data = JSON.parse(data);
        } catch (err) {
          console.log("parse err", err, message.data);
        }
        if (channel && this.channels[channel]) {
          this.channels[channel].emit(event, data);
        } else {
          console.warn("channel not found",{channel,message,data})
        }
      }
    };
    
    this.socket.onerror = (e) => {
      logger.log("socket.onerror", e);
      if (!this.ws) this.fallback = true;
      this.errorDate = new Date().getTime();
      this._update("error", e.toString());
    };

    this.socket.onclose = (e) => {
      logger.log("socket.onclose", e);
      this.fallback = !this.fallback
      // if (!this.ws) this.fallback = true;
      if (this.state !== "destroyed" && this.state !== "closed" && this.state !== "error" && (Date.now() - this.errorDate > 100)) {
        this._update("error", "ws connection closed");
      }
    };
  };

  _reconnect = (timeout) => {
    if (this.state !== "reconnecting") {
      this._update("reconnecting");
      try {
        this.socket && this.socket.close();
      } catch (err) {

      }
      if (this.pong_timeout) clearTimeout(this.pong_timeout);
      if (this.reconnect_timeout) clearTimeout(this.reconnect_timeout);      
      if (this.connect_timeout) clearTimeout(this.connect_timeout);
      if (this.attempts < 5) timeout = 10;
      this.reconnect_timeout = setTimeout(() => {
        this._connect();
      }, timeout);
    }
  };

}