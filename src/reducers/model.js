import { modelActions as actions } from 'store/actions'
import { createReducer } from './utilities'

const getInitialListState = (limit = 9) => ({
  loading: false,
  items: [],
  hasMore: true,
  skip: 0,
  limit: limit  
})

const initialState = {
  profile:  {loading: false},
  event:    {loading: false},
  photos:   getInitialListState(),
  videos:   getInitialListState(),
  timeline: getInitialListState(),
  events:   getInitialListState(),      
  chat:     getInitialListState(20),
  eventChat: [],
}

const setProfile = (state, { data }) => ({...state, profile: data})

const fetchStart = (entity) => (state) => ({...state, [entity]:  {...state[entity],  loading: true}})

const fetchSuccess = (entity) =>  (state, { newItems, skip }) => ({...state, 
  [entity]: {...state[entity],
    items: [...state[entity].items, ...newItems],
    skip,
    hasMore: newItems.length == state[entity].limit,
    loading: false,
  }
})

const updateSuccess = (entity) =>  (state, { updatedItem }) => {
  const ind = state[entity].items.findIndex(i => i._id === updatedItem._id)

  return ({...state, 
    [entity]: {...state[entity],
      items: [ ...state[entity].items.slice(0, ind), updatedItem, ...state[entity].items.slice(ind+1, state[entity].items.length) ],
      loading: false,
    }
  })
}

export const modelReducer = createReducer(initialState, {
  ['model-profile-loaded']: setProfile,
  ['model-profile-updated']: setProfile,
  ['model-follow']: setProfile,
  ['event-chat-loaded']: (state, { data }) => ({...state, eventChat: data}),
  
  [actions.FETCH_PROFILE_START]:    fetchStart("profile"),
  [actions.FETCH_PHOTOS_START]:     fetchStart("photos"),
  [actions.FETCH_VIDEOS_START]:     fetchStart("videos"),
  [actions.FETCH_TIMELINE_START]:   fetchStart("timeline"),
  [actions.FETCH_EVENTS_START]:     fetchStart("events"),
  [actions.FETCH_CHAT_START]:       fetchStart("chat"),
  [actions.UPDATE_EVENT_START]:     fetchStart("events"), 

  [actions.FETCH_PROFILE_SUCCESS]:  (state, { profile }) => ({...state, profile: {...profile, loading: false}}),
  [actions.TOGGLE_LIVE]: (state, { isLive }) => ({...state, profile: {...state.profile, isLive}}),
  [actions.FETCH_PHOTOS_SUCCESS]:   fetchSuccess("photos"),    
  [actions.FETCH_VIDEOS_SUCCESS]:   fetchSuccess("videos"),    
  [actions.FETCH_TIMELINE_SUCCESS]: fetchSuccess("timeline"),    
  [actions.FETCH_EVENTS_SUCCESS]:   fetchSuccess("events"),      
  [actions.FETCH_CHAT_SUCCESS]:     fetchSuccess("chat"), 
  [actions.UPDATE_EVENT_SUCCESS]:   updateSuccess("events"), 
  

})