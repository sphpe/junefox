import React from 'react'

export const List = ({ children }) => (
  <div className="model-table">
    <table className="table table-striped">
      <thead>
        <tr>
          <th className="col1">Model</th>
          <th className="col2">Preview</th>
          <th className="col3">Event Description</th>
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  </div>
)
