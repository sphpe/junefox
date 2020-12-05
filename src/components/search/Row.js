import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Link } from 'react-router-dom'

import { getImage } from 'src/helpers/images'

export const Row = ({ image, name, description, photos, url }) => {

  const ImageWrapper = (imgUrl, key) => (
    <li key={key}>
      <div className="image">
        <div className="bg-stretch">
          <img src={getImage(imgUrl, "discover")}></img>
        </div>
      </div>
    </li>
  )

  return (
    <tr>
      <td>
        <div class="avatar-holder">
          <div class="avatar">
            <Link to={`/model/${url}`}>
              <img src={getImage(image, "discover")} alt="image description" />
            </Link>
          </div>
          <Link to={`/model/${url}`}>
            <span className="name">{name}</span>
          </Link>
        </div>
      </td>
      <td>
        <div className="model-info">
          <span>{moment().toDate().toUTCString()}</span>
          <p>{description}</p>
        </div>
      </td>
      <td>
        <ul className="image-list">
          {photos.map( (imgUrl, key) => (
            ImageWrapper(imgUrl, key)
          ))}
        </ul>
      </td>
    </tr>
  )
}

Row.prototype = {
  item: PropTypes.string,
  image: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.url,
  photos: PropTypes.array,
}