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
    state = {
      recent: {
        items: [],
        itemColumns: [[]],
        total: 0,
        initial: true,
        loading: false
      },
      online: {
        items: [],
        itemColumns: [[]],
        total: 0,
        initial: true,
        loading: false
      },
      models: {}
    };
  }  
  if (action.type == 'discover_loaded') {
    let itemColumns = [];
    for (var i = 0, j = 0; i < action.data.items.length; i++) {
      if (!itemColumns[j]) itemColumns[j] = [];
      itemColumns[j].push(action.data.items[i]);
      j < 3 ? j++ : j = 0;
    }    
    return {
      ...state,
      [action.data.type]: {
        items: action.data.items,
        itemColumns: itemColumns,
        total: typeof action.data.total != 'undefined' ? action.data.total : state[action.data.type].total,
        initial: false,
        loading: false,
      }
    }
  } else if (action.type == 'model_profile_loaded') {
    let id = action.id;
    if (!state.models[id]) {
      state.models[id] = {
        _id: id
      }
    }
    if (action.field == 'profile') {
      state.models[id].profile = action.data
      var followers = state.models[id].profile.followers
      if (followers > 1000000) {
        followers = (followers/1000000).toFixed(1)+"m"
      } else if (followers > 1000) {
        followers = (followers/1000).toFixed(1)+"k"
      }
      state.models[id].profile.followersShort = followers
    } else {
      state.models[id][action.field] = action.data
    }
  }
  return state;
}