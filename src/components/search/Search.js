import React from 'react'

import { List } from './List'
import { Row } from './Row'

const Search = ({ children }) => (
  <div className="container">
    <section className="search-section">
    {children}
    </section>
  </div>
)

Search.List = List
Search.Row = Row

export default Search