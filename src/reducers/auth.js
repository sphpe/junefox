import { setSid, clearSid } from '../helpers/session'
import Sockets from '../helpers/sockets'

export default function authReducer(state, action) {  
  if (typeof state === 'undefined') {
    return {}
  }
  if (action.type == "auth_success") {
    setSid(action.data.sid)
    let socket = new Sockets(action.data.user._id,action.data.sid,true)
    return {
      user: action.data.user,
      params: action.data.params || {},
      dateOffset: Date.now()-action.data.date,
      socket: socket
    }    
  } else if (action.type == "auth_logout") {
    state.socket && state.socket.destroy()
    clearSid();
    if (FB) {
      FB.logout()
    }
    return {};    
  }
  return state;
}