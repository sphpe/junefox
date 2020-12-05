import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import { getImage } from 'src/helpers/images'

export const UserListItem = ({column, c, openPage}) => (
  <div class="col-sm-3" key={c}>
    <ul class="user-list">
      {column.map(item =>
        <li key={item._id}>
          <a href="#" class="user-thumb" onClick={e => openPage(e,"/model/"+item.urlname)}>
            <span class="image-holder"><img src={getImage(item.avatar,"discover")} alt="image description" /></span>
            <span class="video-holder">
              {false && <iframe 
                width="560" 
                height="315" 
                src={item.youtube} 
                frameBorder="0" 
                allow="autoplay; encrypted-media" 
                allowFullScreen>
              </iframe>}
            </span>
            <span class="info">
              <strong class="name">{item.name} <span class="work">Model</span></strong>
              <span class="right-col">
                <span class={"status "+(item.online ? "online" : "")}>
                  {item.online == 1 ? "Online" : moment(item.lastVisit).fromNow()}
                </span>
                <address class="location">{item.location && item.location.city || ""}</address>
              </span>
            </span>
          </a>
        </li>
      )}
    </ul>
  </div>
)

UserListItem.prototype = {
  column: PropTypes.array,
  c: PropTypes.number.isRequired,
  openPage: PropTypes.func.isRequired,
}