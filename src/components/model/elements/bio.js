import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import moment from 'moment'

import api from 'src/helpers/api'

import UploadModal from '../modal/upload'
import CreateEventModal from '../modal/createEvent'
import Payment from '../modal/payment'
import ModalCore from '../modal/ModalCore'

import iconChat from 'assets/images/icon-chat.svg'

import { getImage } from 'src/helpers/images'

import { matchPath } from 'react-router'

import { toggleLiveAction } from 'store/action-creators/model'

class Component extends React.Component {
  
  state = {
    showPayment: false,
    showUnsubscribe: false,
  }

  componentWillMount() {    
    this.urlname = this.props.urlname
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }  

  startEdit = (e,field) => {
    e && e.preventDefault()
    this.setState({
      ["edit_"+field]: true,
      [field]: this.props[field] || ""
    })
  }

  save = (e) => {
    let field = e.target.name
    api("model/update", {
      key: field,
      value: e.target.value
    })
    const { model, model: { urlname: id } } = this.props;
    this.props.modelLoaded({ ...model, [field]: e.target.value }, id, "profile")    
    this.props.modelProfileActions({ data: { ...model, [field]: e.target.value }, type: 'model-profile-updated' })
    this.setState({[`edit_${field}`]: false})
  } 

  toggleModal = (key, show = true) => {
    if( show )
      document.body.classList.add('modal-open');
    else
      document.body.classList.remove('modal-open');

    this.setState({ [key]: show });
  }

  followClickHandler = (e) => {
    e.preventDefault();
    const { model: { isSubscribed, expireAt } } = this.props;
    if(typeof isSubscribed === 'boolean') {
      if(!isSubscribed && (!expireAt || expireAt < +(new Date()))) {
        this.toggleModal('showPayment');
      }
      this.changeSubscriptionState(e);
      return;
    }
    this.subscribeHandle(e);
  }

  subscribeHandle = (e) => {
    const { model: { _id: modelId, urlname } } = this.props;
    const data = {
      urlname,
      modelId,
      level: 1,
    };
    api('model/subscribe', data).then(res => {
      this.toggleModal('showPayment');
      this.props.modelProfileActions({ data: res, type: 'model-follow' });
    });
  }

  changeSubscriptionState = (e) => {
    const { model: { _id: modelId, isSubscribed } } = this.props;
    if(isSubscribed) this.toggleModal('showUnsubscribe');
    api('model/changeState', { modelId, state: !isSubscribed })
      .then(({ value }) => this.props.modelProfileActions({ data: value, type: 'model-follow' }));
  }

  render() {
    const { model: profile, model: { urlname: id }, modelProfileActions, modelLoaded } = this.props;   
    let isOwner = this.props.isOwner
    const { showPayment, showUnsubscribe } = this.state
    return (
      <div>
        <div class="bio-block">
          {this.state.modal && this.state.modal !='addEvent' && 
            <UploadModal 
              onClose={e => this.setState({modal: false})} 
              type={this.state.modal} 
              userId={id}
            />
          }
          {this.state.modal && this.state.modal == 'addEvent' && 
            <CreateEventModal
              onClose={e => this.setState({modal: false})}
              userId={id}
            />
          }   
          {showPayment && <Payment closeModal={() => this.toggleModal('showPayment', false)} />}
          {showUnsubscribe &&
            (<ModalCore closeModal={() => this.toggleModal('showUnsubscribe', false)}>
              <div className="Checkout"><h2>Your subscription remains active, if you want to manage that go to Manage subscriptions</h2></div>
            </ModalCore>)
          }              
          <div class="d-flex align-items-center bio-holder">
            <div class="profile-picture">
              <a href="#">
                <img class="img-fluid" src={getImage(profile.avatar,"avatar")} alt="image description" />
              </a>
            </div>
            <div class="follow-holder">
              <Link to={"/model/"+id+"/chat"} class="chat-link d-none d-lg-block">
                <img src={iconChat} alt="image description" width="48" />
              </Link>
              <div class="bio-header d-none d-lg-flex align-items-lg-center">
                <h2>{profile.tagname} <span class="verified"><i class="icon-star"></i></span></h2>
                {isOwner
                  ? <span>subscription price:</span>
                  : <a
                      href="#"
                      class="btn btn-secondary"
                      onClick={this.followClickHandler}>
                        {profile.isSubscribed ? 'Unfollow' : 'Follow'}
                    </a>
                }
                {this.state.edit_price 
                  ? <input 
                      class="form-control ml-2 col-2 d-inline"
                      type="number"
                      name="price" 
                      value={this.state.price} 
                      onChange={this.handleChange} 
                      onBlur={this.save} />
                  : <span class="price mr-2">${profile.price || 0}</span>
                }
                {isOwner && !this.state.edit_price &&
                  <a class="" href="#" onClick={e => this.startEdit(e,"price")}>edit</a>
                }                        
              </div>
              <ul class="follow-info">
                <li>
                  <span class="number">{profile.posts || 0} </span>
                  <span class="text">posts</span>
                </li>
                <li>
                  <span class="number">{profile.followersCount || 0} </span>
                  <span class="text">followers</span>
                </li>
                <li>
                  <span class="number">{profile.following || 0} </span>
                  <span class="text">following</span>
                </li>
              </ul>
              <div class="action-field d-lg-none">
                <a href="#" class="btn btn-secondary">Following</a>
                <a href="live-chat.html" class="btn btn-primary btn-submit"><i class="icon-thunder"></i></a>
              </div>
              <p class="d-none d-lg-block">
                <span class="name mr-2">{profile.name}</span> 
                {this.state.edit_description 
                  ? <input 
                      class="form-control ml-2 col-5 d-inline"
                      type="text"
                      placeholder="description"
                      name="description" 
                      value={this.state.description} 
                      onChange={this.handleChange} 
                      onBlur={this.save} />
                  : <span class="mr-2">{profile.description}</span>
                }
                {isOwner && !this.state.edit_description &&
                  <a class="" href="#" onClick={e => this.startEdit(e,"description")}>edit</a>
                }
              </p>
              <ul class="button-list d-none d-lg-flex">
                <li>
                  <Link to={`/model/${id}/timeline`} class="btn btn-secondary">line</Link>
                  {isOwner && 
                    <a href="#" class="upload-btn" onClick={e => this.setState({modal: "timeline"})}><span data-toggle="tooltip" title="Upload">+</span></a>
                  }
                </li>
                <li>
                  <Link to={`/model/${id}/photo`} class="btn btn-secondary" >photo</Link>
                  {isOwner && 
                    <a href="#" class="upload-btn" onClick={e => this.setState({modal: "photo"})}>
                      <span data-toggle="tooltip" title="Upload">+</span>
                    </a>
                  }
                </li>
                <li>
                  <Link to={`/model/${id}/video`} class="btn btn-secondary">video</Link>
                  {isOwner && 
                    <a href="#" class="upload-btn" onClick={e => this.setState({modal: "video"})}>
                      <span data-toggle="tooltip" title="Upload">+</span>
                    </a>
                  }
                </li>                     
              </ul>
            </div>
          </div>
          {isOwner && 
            <div class="stream-button">                    
              <button class="btn btn-primary" onClick={e => this.setState({modal: "addEvent"})}>
                <i class="icon-add"></i>Add Streaming Event
              </button>               
            </div>
          }                       
          <div class="stream-button">
            <Link to={`/model/${id}/events`} class="btn btn-primary col-lg-2">
              View Streaming Events
            </Link>
          </div>       
          {isOwner && 
            <div class="stream-button">                    
              <button class="btn btn-primary col-lg-2" onClick={e => this.props.toggleLive(!this.props.isLive)}>
                {this.props.isLive ? "Stop live" : "Start live"}
              </button>               
            </div>
          }                      
          <div class="bio-header d-lg-none">
            <h2>{profile.name} <span class="verified"><i class="icon-star"></i></span></h2>
            <p>{profile.description}</p>
          </div>
        </div>
        <div class="container d-lg-none">
          <div class="gallery-block">
            <nav class="gallery-menu">
              <ul>
                <li>
                  <Link to={`/model/${id}/timeline`}>timeline</Link>
                  {isOwner && 
                    <a href="#" class="upload-btn" onClick={e => this.setState({modal: "timeline"})}>
                      <span data-toggle="tooltip" title="Upload">+</span>
                    </a>
                  }                        
                </li>
                <li>
                  <Link to={`/model/${id}/photo`}>photo</Link>
                  {isOwner && 
                    <a href="#" class="upload-btn" onClick={e => this.setState({modal: "photo"})}>
                      <span data-toggle="tooltip" title="Upload">+</span>
                    </a>
                  }                        
                </li>
                <li>
                  <Link to={`/model/${id}/video`}>video</Link>
                  {isOwner && 
                    <a href="#" class="upload-btn" onClick={e => this.setState({modal: "video"})}>
                      <span data-toggle="tooltip" title="Upload">+</span>
                    </a>
                  }                        
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ session, currentModel, search }) => ({
  model: currentModel.profile,
  ...currentModel.profile,
  isOwner: currentModel.profile.urlname == session.user.urlname,
})

const mapDispatchToProps = ({
  modelLoaded: (data, id, field) => ({
    type: "model_profile_loaded",
    id: id,
    field: field,
    data: data,
  }),
  modelProfileActions: ({ data, type }) => ({ type, data }),
  toggleLive: toggleLiveAction,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps 
)(Component)

