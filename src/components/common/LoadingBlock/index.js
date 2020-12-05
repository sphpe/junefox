import React from 'react'
import PropTypes from 'prop-types'

import { ClipLoader } from 'react-spinners'

export const LoadingBlock = ({ active }) => (
  <div className="w-100 d-flex justify-content-center">
    <ClipLoader loading={active} />
  </div>
)

LoadingBlock.prototype = {
  active: PropTypes.bool.isRequired,
}