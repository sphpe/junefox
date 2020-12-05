import React from 'react';
import { Route, Switch, Redirect, withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux'
import moment from 'moment'
import Swiper from 'react-id-swiper';


import api from 'src/helpers/api'

import Header from '../header'
import Footer from '../footer'
import UploadModal from './modal/upload'
import CreateEventModal from './modal/createEvent'
import Payment from './modal/payment'
import ModalCore from './modal/ModalCore'
import Photos from './tabs/photo'
import Videos from './tabs/videos'
import Timeline from './tabs/timeline'
import Events from './tabs/events'
import ModelEvent from './event'

import ModelChat from './chat'
import Followings from './followings'
import Followers from './followers'
import EventPreview from './eventPreview'

import Bio from './elements/bio'
import Live from './elements/live'

import { loadProfileAction } from 'store/action-creators/model'

import iconChat from 'assets/images/icon-chat.svg'

import { getImage, getVideo } from 'src/helpers/images'

import "video-react/dist/video-react.css"
import { Player } from 'video-react'

import { matchPath } from 'react-router'

class Component extends React.Component {

  swipeParams = {
    slidesPerView: 3,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next.swiper-button-white',
      prevEl: '.swiper-button-prev.swiper-button-white',
    },
    breakpoints: {
      991: {
        slidesPerView: 2,
        centeredSlides: true,
      }
    }
  }

  componentWillMount() {
    this.urlname = this.props.match.params.id
    this.loadProfile()
  }

  loadProfile() {
    this.props.loadProfile(this.props.match.params.id)
    // api("model/profile",{
    //   id: this.urlname,
    //   skip: 0, 
    //   limit: 20
    // }).then((res) => {
    //   this.props.modelProfileActions({ data: res, type: "model-profile-loaded" });
    //   this.props.modelLoaded(res,this.urlname,"profile") 
    // })
  }

  render() {
    const { model: profile, model: { urlname: id }, modelProfileActions, modelLoaded } = this.props;   
    return (
      <div>             
        <Header page='model' id={id} />
        <main id="main">
          {this.props.isLive && <Live />}
          {!this.props.isLive && this.props.swipePhotos.length > 0 &&
            <Swiper {...this.swipeParams}>
              {this.props.swipePhotos.map((photo,i) =>
                <div class="swiper-slide" key={i}>
                  <img src={getImage(photo,"swiper")} alt="image description" class="swiper-lazy" />
                </div>
              )}
            </Swiper>            
          }
          <div class="content-block">
            {this.props.loading && 
              <div class="container">loading..</div>
            }
            {!this.props.loading && 
              <div class="container">
                <Bio urlname={id} />
                <div class="gallery-block">
                  <Switch>                    
                    <Route path="/model/:id/video"          component={Videos} />
                    <Route path="/model/:id/timeline"       component={Timeline} />
                    <Route path="/model/:id/events"         component={Events} />
                    <Route path="/model/:id/event/:eventId" component={ModelEvent} />
                    
                    <Route path="/model/:id/chat"           component={ModelChat} />
                    <Route path="/model/:id/followers"      component={Followers} />
                    <Route path="/model/:id/event-preview"  component={EventPreview} />   

                    <Route path="/model/:id"                component={Photos} />
                  </Switch>            
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

const mapStateToProps = ({ session, currentModel, search }) => ({
  swipePhotos: currentModel.profile.photo || [],
  loading: currentModel.profile.loading,
  isLive: currentModel.profile.isLive,

  user: session.user,
  model: currentModel.profile,
  searchKey: search.searchKey,
  searchResults: search.searchList,
  searchFetching: search.searchFetching,
  searchDidFetch: search.searchDidFetch,
})

const mapDispatchToProps = ({
  loadProfile: loadProfileAction
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps 
)(Component))