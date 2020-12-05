import { searchActions as actions } from 'store/actions'
import { makeRequest } from 'store/action-creators/requests'

const updateSearchKeyword = searchKey => ({
  type: actions.UPDATE_SEARCH_KEYWORD,
  searchKey,
})

const sendSearchResultRequest = (searchKey, skip, total) => makeRequest(
  'fetch-search',
  'model/search', 
  {
    searchKey,
    skip,
    total,
  }
)

export const updateSearchAction = (searchKey, skip, total) => async (dispatch) => {
  const fetchedSearchList = []
  
  dispatch(updateSearchKeyword(searchKey))

  try {
    const { data: responseData } = await dispatch(sendSearchResultRequest(searchKey, skip, total))
    const { total, result} = responseData
    fetchedSearchList.push(...result)

    dispatch({ type: actions.FETCH_SEARCH_SUCCESS, searchList: fetchedSearchList, total: total })

    
  } catch (err) {
    // dispatch(actionError(err, addError))
    console.log('api error = ', err)
  }
  
  return fetchedSearchList
}