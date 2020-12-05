const https = location.protocol == "https:"

const config = {
  env: process.env.NODE_ENV,
  api_local: process.env.API_LOCAL,
  stripe: {
    pk: 'pk_test_rnkROwTDBg3dIkpPikSQsQ66',
    sk: 'sk_test_TTeH29ZmA3JNJX4AhWAi3cwu'
  },
  content: {
    limit: 50,
  },
  http: {
    hosts: [
      "//api.junefox.com:"+(https ? 4443 : 4000)
    ]
  },
  sockets: {
    hosts: [
      "socket.junefox.com"
    ],
    ws_port: 8080,
    wss_port: 8081,
    timeout: {
      ping: 50 * 1000,
      pong: 4 * 60 * 1000,
      connect: 2 * 1000,
      reconnect: 5*1000       
    }
  },
  imageServer: "//img.junefox.com:"+(https ? 4443 : 4000),
  fb: {
    appId: "462644514226751",
    // scope: "name,email,picture,public_profile,user_location,user_photos",
    scope: "email, public_profile",
    // version: "2.7"         
  },
  thumb: "http://static.contentvoo.com/media/thumb_no_man.png",
  sessionPrefix: "foxvoo_"
}

if (config.env == "development") {  
  config.fb.appId = "248923695204485"
}
if (config.api_local == '1') {
  if (https) {
    config.http.hosts = ["//localhost:4443"]
    config.sockets.hosts = ["localhost"]
    config.imageServer = "//localhost:4443"
  } else {
    config.http.hosts = ["//localhost:4000"]
    config.sockets.hosts = ["localhost"]
    config.imageServer = "//localhost:4000"
  }
}

export default config