import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import moment from 'moment'

import api from 'src/helpers/api'

import Header from '../header'
import Footer from '../footer'
import { getImage, getVideo } from 'src/helpers/images'

import BuyTokens from './modal/buyTokens'

import iconChat from 'assets/images/icon-chat.svg'

class Component extends React.Component {
  
  state = {
    showModal: false
  }

  componentWillMount() {
    if (!this.props.models[this.props.match.params.id]) this.loadProfile()
  }

  loadProfile() {
    let id = this.props.match.params.id
    api("model/profile",{
      id: this.props.match.params.id,
      skip: 0, 
      limit: 20
    }).then((res) => {
      this.props.modelLoaded(res,this.props.match.params.id,"profile")
      setTimeout(()=>{
        this.setState({profileLoaded: true})  
      }, 0)
      
    })
  }

  clickHandle = e => {
    this.setState( prevState => ({ showModal: !prevState.showModal }))
  }

  render() {       
    let id = this.props.match.params.id
    let model = this.props.models[id]
    let profile = model && model.profile
    return (
      <div>
        <Header page='model' id={id} />
        <main id="main">
          <div class="content-block">
            { this.state.showModal && <BuyTokens close={this.clickHandle} {...this.props} />}
            {!profile && 
              <div class="container">loading..</div>
            }
            {profile && 
              <div class="container">
                <div class="bio-block">
                  <div class="d-flex align-items-center bio-holder">
                    <div class="profile-picture">
                      <a href="#">
                        <img class="img-fluid" src={profile.picture} alt="image description" />
                      </a>
                    </div>
                    <div class="follow-holder">
                      <a href="live-chat.html" class="chat-link d-none d-lg-block">
                        <img src={iconChat} alt="image description" width="48" />
                      </a>
                      <div class="bio-header d-none d-lg-flex align-items-lg-center">
                        <h2>{profile.tagname} <span class="verified"><i class="icon-star"></i></span></h2>
                        <a href="#" class="btn btn-secondary">Following</a>
                        <span class="price">$ {profile.price}</span>
                      </div>
                      <ul class="follow-info">
                        <li>
                          <span class="number">{profile.posts}</span>
                          <span class="text">posts</span>
                        </li>
                        <li>
                          <span class="number">{profile.followersShort}</span>
                          <span class="text">followers</span>
                        </li>
                        <li>
                          <span class="number">{profile.following}</span>
                          <span class="text">following</span>
                        </li>
                      </ul>
                      <div class="action-field d-lg-none">
                        <a href="#" class="btn btn-secondary">Following</a>
                        <a href="live-chat.html" class="btn btn-primary btn-submit"><i class="icon-thunder"></i></a>
                      </div>
                      <p class="d-none d-lg-block"><span class="name">{profile.name}</span> {profile.description}</p>
                      <ul class="button-list d-none d-lg-flex">
                        <li><Link class="btn btn-secondary" to={"/model/"+id+"/timeline"}>line</Link></li>
                        <li><Link class="btn btn-secondary" to={"/model/"+id+"/photo"}>photo</Link></li>
                        <li><Link class="btn btn-secondary" to={"/model/"+id+"/video"}>video</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div class="stream-button">
                    <button class="btn btn-primary" data-toggle="modal" data-target="#loginModal" onClick={this.clickHandle}><i class="icon-add"></i>Join Streaming Event</button>
                  </div>
                  <div class="bio-header d-lg-none">
                    <h2>{profile.name} <span class="verified"><i class="icon-star"></i></span></h2>
                    <p>{profile.description}</p>
                  </div>
                </div>
                <div class="gallery-block">
                  <nav class="gallery-menu d-lg-none">
                    <ul>
                      <li><Link to={"/model/"+id+"/timeline"}>timeline</Link></li>
                      <li><Link to={"/model/"+id+"/photo"}>photo</Link></li>
                      <li><Link to={"/model/"+id+"/video"}>video</Link></li>
                    </ul>
                  </nav>
                  {profile.photo.length > 0 && 
                    <ul class="gallery-list add">
                      {profile.photo.map(photo =>
                        <li key={photo}>
                          <a href={photo} data-fancybox="lightbox">
                            <img class="img-fluid" src={getImage(photo, 'orig')} alt="image description" />
                          </a>
                        </li>
                      )}
                    </ul>
                  }
                  {profile.video.length > 0 && 
                    <section class="video-section">
                      <h2 class="text-center"><span>Videos</span></h2>
                      {profile.video.map(video => 
                        <div class="video" key={video}>
                          <iframe width="560" height="315" src={getVideo(video, 'orig')} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                        </div>
                      )}
                    </section>
                  }
                  <div class="personal-details">
                    <div class="detail-section">
                      <div class="info-title">Event Title</div>
                      <div class="info-content">
                        <div class="form-group">
                          <textarea cols="30" rows="10" class="form-control" placeholder="Add the event title"></textarea>
                          <i class="icon-angle-right"></i>
                        </div>
                      </div>
                    </div>
                    <div class="detail-section">
                      <div class="info-title">Price</div>
                      <div class="info-content">
                        <div class="form-group">
                          <textarea cols="30" rows="10" class="form-control" placeholder="Set price">{"$"+profile.price}</textarea>
                          <i class="icon-angle-right"></i>
                        </div>
                      </div>
                    </div>
                    <div class="detail-section">
                      <strong class="info-title">Notification options</strong>
                      <div class="info-content d-flex align-items-center justify-content-between">
                        <span class="d-flex align-items-center setting-option">Newsletter to followers</span>
                        <div class="setting-value">
                          <span class="switch">
                            <input checked="checked" type="checkbox" class="switch" id="newsletter" />
                            <label for="newsletter">Newsletter to followers</label>
                          </span>
                        </div>
                      </div>
                      <div class="info-content d-flex align-items-center justify-content-between">
                        <span class="d-flex align-items-center setting-option">Reminders to myself</span>
                        <div class="setting-value">
                          <span class="switch">
                            <input checked="checked" type="checkbox" class="switch" id="reminder" />
                            <label for="reminder">Reminders to myself</label>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="detail-section">
                      <div class="info-title">about me</div>
                      <div class="info-content">
                        <div class="form-group">
                          <textarea cols="30" rows="2" class="form-control about" placeholder="Write something about you..."></textarea>
                          <span class="counter">500</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </main>
        <Footer dark={true} />
      </div>
    )
  }
}

export default connect(
  function (state) {
    return {
      models: state.discover.models
    };
  }, {
    modelLoaded: function(data,id,field){
      return {
        type: "model_profile_loaded",
        id: id,
        field: field,
        data: data
      }
    }
  })(Component)