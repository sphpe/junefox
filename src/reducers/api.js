const initialState = {
  initial: {
    initial: true,
    loading: false,
    error: false,
    items: [],
    total: {},
    data: {}    
  }
}

const usersState = {};

export default function apiReducer (state,action) {
  if (typeof state === 'undefined') {
    state = initialState;
  }  
  // var key,apiState;
  let {key, type} = action;
  var apiState;
  switch (type) {
    case "api":          
      apiState = state[key] || state.initial;  
      if (apiState.loading && apiState.request) {
        apiState.request.cancel()
      }
      if (key == "auth_logout") {
        if (action.keepSid && action.aid) {
          usersState[action.aid] = state;
        }
        return initialState;
      }
      return {
        ...state,
        [key]: {
          initial: false,
          loading: true,
          error: false,
          data: apiState.data,
          items: apiState.items,
          total: apiState.total
        }
      }     
    case "api_success":
      if (key == "auth_logback") {
        let aid = action.data.user.aid
        if (usersState[aid]) {
          state = usersState[aid]  
        }        
      }
      apiState = state[key] || state.initial;  
      let actionData = action.data || {};   
      return {
        ...state,
        [key]: {
          initial: false,
          loading: false,
          error: false,
          data: actionData,    
          items: actionData.items || action.items || [],
          total: (action.params && action.params.load_total) ? actionData.total || {} : apiState.total                        
        }
      };      
    case "api_failure":
      apiState = state[key] || state.initial;      
      return {
        ...state,
        [key]: {
          initial: false,
          loading: false,
          error: action.error.toString(),
          data: {},
          items: [],
          total: apiState.total
        }
      };      
  }
  return state;
}