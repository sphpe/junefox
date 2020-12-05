import { createSelector } from 'reselect'

const getSearchResult = ({ searchList }) => searchList

export const getSearchedUsers = createSelector(
  [getSearchResult],
  (searchList) => Object.values(searchList).sort((a,b) => (a.name < b.name ? -1 : 1)),
)

export const getSearchedCount = createSelector(
  [getSearchResult],
  (searchList) => searchList.length,
)