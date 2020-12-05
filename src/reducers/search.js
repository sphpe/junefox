import { initialState } from 'store/initialState'
import { searchActions as actions } from 'store/actions'
import { createReducer } from './utilities'

const { search } = initialState

const setSearchFetchingStatus = (state, { searchFetching }) => ({
  ...state,
  searchFetching,
})

const updateSearchKey = (state, { searchKey }) => ({
  ...state,
  searchKey,
  searchFetching: true,
})

const setSearchList = (state, { searchList, total }) => ({
  ...state,
  searchList,
  total,
  searchFetching: false,
  searchDidFetch: true,
})

const clearSearchList = state => ({
  ...state,
  searchList: [],
  searchDidFetch: false,
})

const searchError = (state, { error }) => ({
  ...state,
  errors: [...state.errors, error],
})

export const searchReducer = createReducer(search, {
  [actions.FETCH_SEARCH_START]: setSearchFetchingStatus,
  [actions.FETCH_SEARCH_SUCCESS]: setSearchList,
  [actions.SEARCH_ERROR]: searchError,
  [actions.UPDATE_SEARCH_KEYWORD]: updateSearchKey,
  [actions.CLEAR_SEARCH_LIST]: clearSearchList,
})