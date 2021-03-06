export const requestActions = {
  REQUEST: 'REQUEST/REQUEST',
  FAILED:  'REQUEST/FAILED',
  SUCCESS: 'REQUEST/SUCCESS',
}

export const searchActions = {
  FETCH_SEARCH_START:     'SEARCH/FETCH_SEARCH_START',
  FETCH_SEARCH_SUCCESS:  'SEARCH/FETCH_SEARCH_SUCCESS',
  SEARCH_ERROR:           'SEARCH/SEARCH_ERROR',
  UPDATE_SEARCH_KEYWORD:  'SEARCH/UPDATE_SEARCH_KEYWORD',
  CLEAR_SEARCH_LIST:      'SEARCH/CLEAR_SEARCH_LIST',
}

export const modelActions = { 
  FETCH_PROFILE_START:    'MODEL/FETCH_PROFILE_START',
  FETCH_PROFILE_SUCCESS:  'MODEL/FETCH_PROFILE_SUCCESS',

  FETCH_PHOTOS_START:     'MODEL/FETCH_PHOTOS_START',
  FETCH_PHOTOS_SUCCESS:   'MODEL/FETCH_PHOTOS_SUCCESS',

  FETCH_VIDEOS_START:     'MODEL/FETCH_VIDEOS_START',
  FETCH_VIDEOS_SUCCESS:   'MODEL/FETCH_VIDEOS_SUCCESS',

  FETCH_TIMELINE_START:   'MODEL/FETCH_TIMELINE_START',
  FETCH_TIMELINE_SUCCESS: 'MODEL/FETCH_TIMELINE_SUCCESS', 

  FETCH_EVENTS_START:     'MODEL/FETCH_EVENTS_START',
  FETCH_EVENTS_SUCCESS:   'MODEL/FETCH_EVENTS_SUCCESS',

  FETCH_CHAT_START:       'MODEL/FETCH_CHAT_START',
  FETCH_CHAT_SUCCESS:     'MODEL/FETCH_CHAT_SUCCESS',  

  ADD_PHOTOS_START:       'MODEL/ADD_PHOTOS_START',
  ADD_PHOTOS_SUCCESS:     'MODEL/ADD_PHOTOS_SUCCESS',

  SET_AVATAR_START:       'MODEL/SET_AVATAR_START',
  SET_AVATAR_SUCCESS:     'MODEL/SET_AVATAR_SUCCESS',          

  UPDATE_EVENT_START:     'MODEL/UPDATE_EVENT_START',
  UPDATE_EVENT_SUCCESS:   'MODEL/UPDATE_EVENT_SUCCESS',  

  TOGGLE_LIVE:            'MODEL/TOGGLE_LIVE',
}

export const userActions = {
  UPDATE_AVATAR:          'USER/UPDATE_AVATAR',
}