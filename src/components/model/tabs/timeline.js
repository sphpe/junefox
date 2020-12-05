import React from 'react';
import { connect } from 'react-redux'
import moment from 'moment'
import InfiniteScroll from 'react-infinite-scroll-component';

import api from 'src/helpers/api'

import { getImage, getVideo } from 'src/helpers/images'

import "video-react/dist/video-react.css"
import { Player } from 'video-react'
import { loadTimelineAction } from 'store/action-creators/model'


class TimelineTab extends React.Component {

  componentWillMount() {
    this.load()
  }

  load = () => {
    if (this.props.loading || !this.props.hasMore) return;
    this.props.load(this.props.match.params.id,this.props.skip,this.props.limit)
  }

  // TODO - move to redux
  like = (post,e) => {
    e && e.preventDefault()
    let original = post.likes
    // post.likes += post.liked ? -1 : 1;
    post.liked = !post.liked
    api("model/like",{
      id: post._id,
      liked: post.liked
    }).then(res => {
      if (res.val) {
        post.likes = original + res.val        
      } else {
        // post.likes = original
        // post.liked = !post.liked
      }
      this.setState({refresh: true})  
    })
  }

  render() {
    const { hasMore, items, profile } = this.props;
    let itemsLength = items.length       
    return (
      <div class="timeline-holder">
        <div class="row">
          <div class="col-md-8">    
            <InfiniteScroll
              dataLength={itemsLength}
              next={this.load}
              hasMore={false}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  {itemsLength > 0 ? <b>Yay! You have seen it all</b> : <b>No content</b>}
                </p>
              }
              style={{ overflowX: 'hidden' }}
            >
              {items.map((post,i) =>
                <div class="timeline-box" key={post._id || i}>
                  <div class="box-heading">
                    <div class="user">
                      <a class="user-link" href="#">
                        <span class="avatar">
                          <img src={getImage(profile.avatar,"avatar")} alt="image description" />
                        </span>
                        <span class="text">{profile.name}</span>
                      </a>
                    </div>
                  </div>
                  <div class="image-holder">
                    {post.contentType == "photo" &&
                      <img src={getImage(post.contentId,"swiper")} alt="image description" />
                    }
                    {post.contentType == "video" && 
                      <Player playsInline src={getVideo(video,"orig")} />
                    }
                  </div>
                  <div class="action-area">
                    <ul class="actions">
                      <li><a href="#" onClick={e => this.like(post,e)}><i class="icon-heart"></i></a></li>
                      {false && <li><a href="#"><i class="icon-chat-bubble"></i></a></li>}
                    </ul>
                    <span class="likes"><a href="#">{post.likes} likes</a></span>
                  </div>
                </div>
              )}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    )
  }  

}

export default connect(
  ({ currentModel }) => ({profile: currentModel.profile, ...currentModel.timeline}),
  {load: loadTimelineAction}
)(TimelineTab);