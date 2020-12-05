import { modelActions as actions } from 'store/actions'
import { makeRequest } from 'store/action-creators/requests'

export const loadProfileAction = (id) => async (dispatch) => {
  dispatch({type: actions.FETCH_PROFILE_START})
  try {
    const { data: profile } = await dispatch(makeRequest('fetch-profile', 'model/profile', {id}))
    dispatch({ type: actions.FETCH_PROFILE_SUCCESS, profile })    
  } catch (err) {
    console.log('api error = ', err)
  }
}

export const loadPhotosAction = (id, skip, limit) => async (dispatch) => {
  dispatch({type: actions.FETCH_PHOTOS_START})
  try {
    const { data: newItems } = await dispatch(makeRequest('fetch-photos', 'model/photos', {id, skip, limit}))
    dispatch({ type: actions.FETCH_PHOTOS_SUCCESS, newItems, skip: skip+limit })    
  } catch (err) {
    console.log('api error = ', err)
  }
}

export const loadVideosAction = (id, skip, limit) => async (dispatch) => {
  dispatch({type: actions.FETCH_VIDEOS_START})
  try {
    const { data: newItems } = await dispatch(makeRequest('fetch-videos', 'model/videos', {id, skip, limit}))
    dispatch({ type: actions.FETCH_VIDEOS_SUCCESS, newItems, skip: skip+limit })    
  } catch (err) {
    console.log('api error = ', err)
  }
}

export const loadTimelineAction = (id, skip, limit) => async (dispatch) => {
  dispatch({type: actions.FETCH_TIMELINE_START})
  try {
    const { data: newItems } = await dispatch(makeRequest('fetch-timeline', 'model/timeline', {id, skip, limit}))
    dispatch({ type: actions.FETCH_TIMELINE_SUCCESS, newItems, skip: skip+limit })    
  } catch (err) {
    console.log('api error = ', err)
  }
}

export const loadEventsAction = (id, skip, limit) => async (dispatch) => {
  dispatch({type: actions.FETCH_EVENTS_START})
  try {
    const { data: newItems } = await dispatch(makeRequest('fetch-events', 'event/list', {id, skip, limit}))
    dispatch({ type: actions.FETCH_EVENTS_SUCCESS, newItems, skip: skip+limit })    
  } catch (err) {
    console.log('api error = ', err)
  }
}

export const loadChatAction = (id, skip, limit) => async (dispatch) => {
  dispatch({type: actions.FETCH_CHAT_START})
  try {
    const { data: newItems } = await dispatch(makeRequest('fetch-events', 'model/chat', {id, skip, limit}))
    dispatch({ type: actions.FETCH_CHAT_SUCCESS, newItems, skip: skip+limit })    
  } catch (err) {
    console.log('api error = ', err)
  }
}

export const updateEventAction = ({ id, key, value }) => async (dispatch) => {
  dispatch({type: actions.UPDATE_EVENT_START})
  try {
    const { data: updatedItem } = await dispatch(makeRequest('update-event', 'event/update', {id, key, value}))
    dispatch({ type: actions.UPDATE_EVENT_SUCCESS, updatedItem })    
  } catch (err) {
    console.log('api error = ', err)
  }
}

export const toggleLiveAction = (isLive) => async (dispatch) => {
  dispatch({type: actions.TOGGLE_LIVE, isLive})  
  try {
    await dispatch(makeRequest('toggle-live', 'model/toggle_live', {isLive}))
  } catch (err) {
    console.log('api error = ', err)
  }
}