const initial = {
  initial: true
}

const usersState = {};

export default function stateReducer(state, action) {  
  if (typeof state === 'undefined') {
    return {initial}
  }  
  let {type, key, data, cb} = action;

  if (type == "state_set") {
    let curComponentState = state[key] || {};
    for (let dataKey in data) {
      curComponentState[dataKey] = data[dataKey]
    }
    if (cb) {
      setTimeout(cb,0)
    }
    return {
      ...state,
      [key]: curComponentState
    }
  }
  if (key == "auth_logout" && type == "api") {
    if (action.keepSid && action.aid) {
      usersState[action.aid] = state
    }
    return {initial};
  }
  if (key == "auth_logback" && type == "api_success") {
    let aid = action.data.user.aid
    if (usersState[aid]) {
      return usersState[aid]  
    }
  }
  return state;
}