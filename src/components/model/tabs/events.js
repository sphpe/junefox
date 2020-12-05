import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import moment from 'moment'
import { Player } from 'video-react'
import InfiniteScroll from 'react-infinite-scroll-component'

import api from 'src/helpers/api'

import { getImage, getVideo } from 'src/helpers/images'
import config from 'src/config'
import EditEventModal from '../modal/editEvent'

import { loadEventsAction } from 'store/action-creators/model'

class EventsTab extends React.Component {
  
  state = {
    openEdit: false,
    editEvent: null,
    id: undefined
  }

  componentWillMount() {
    this.load()
  }

  load = () => {
    if (this.props.loading || !this.props.hasMore) return;
    this.props.load(this.props.match.params.id,this.props.skip,this.props.limit)
  }  

  edit = (e, event) => {
    this.setState({
      openEdit: true,
      editEvent: event
    });
  }

  closeEdit = () => this.setState({ openEdit: false })

  render() {       
    let id = this.props.match.params.id
    console.log("events render",this.props)
    return (
      <section class="events-section">
        <h2 class="text-center"><span>My Streaming Events</span></h2>
        <InfiniteScroll
          dataLength={this.props.items.length}
          next={this.load}
          hasMore={this.props.hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
              <p style={{textAlign: 'center'}}>
                  {this.props.items.length > 0 ? <b>Yay! You have seen it all</b> : <b>No content</b>}
              </p>
          }
          style={{ overflowX: 'hidden' }}
        >
          <ul class="events-list">
            {this.props.items.map(event=>            
              <li key={event._id}>              
                <section class="event-box">
                  <div class="preview">
                    {event.images && event.images.length > 0 && event.images.map(imageId =>
                      <span class="image-holder">
                        <span class="bg-stretch">
                          <img src={getImage(imageId,"gallery")} alt="image description" />
                        </span>
                      </span>
                    )}
                    {event.video && event.video.length > 0 && event.video.map(videoId =>
                      <Player playsInline src={getVideo(videoId,"orig")} />
                    )}                  
                  </div>
                  <div class="description">
                    <div class="row">
                      <div class="col-8">
                        <h3><a href="#">{event.title}</a></h3>
                      </div>
                      <div class="col-4 text-right">
                        {this.props.isOwner && 
                          <span class="switch">
                            <input type="checkbox" class="switch" id="switch1" />
                            <label for="switch1">Automatic Gain Control</label>
                          </span>
                        }
                      </div>
                    </div>
                    <div class="event-date">{moment(event.startDate).format("MMMM DD, YYYY")}<span class="time">{moment(event.startDate).format("HH:mm")}</span></div>
                    <p>{event.description}</p>
                    <div class="form-group">
                      <input type="text" class="form-control" value={`https://junefox.com/model/${id}/event/${event._id}`} disabled />
                      <button class="btn-copy"><i class="icon-content_copy"></i></button>
                    </div>
                    <div class="row">
                      <div class="col-sm-7">
                        <Link to={`/model/${id}/event/${event._id}`}>
                          <button class="btn btn-warning">Stream @ ${event.price || 0}</button>
                        </Link>
                      </div>
                      <div class="col-sm-5 text-right">
                        {this.props.isOwner && <button class="btn btn-primary" onClick={e => this.edit(e, event)}>Edit</button>}
                      </div>
                    </div>
                  </div>
                </section>
              </li>
            )}
          </ul>
        </InfiniteScroll>
        {this.state.openEdit &&
          <EditEventModal
            onClose={this.closeEdit}
            editEvent={this.state.editEvent}
          />
        }        
      </section>
    )
  }
}

export default connect(
  ({ currentModel, session }) => ({...currentModel.events, isOwner: currentModel.profile._id == session.user._id }),
  {load: loadEventsAction}
)(EventsTab);