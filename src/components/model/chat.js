import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import moment from 'moment'

import api from 'src/helpers/api'

import Header from '../header'
import Footer from '../footer'

class Component extends React.Component {
  
  componentWillMount() {
    let model = this.props.models[this.props.match.params.id]
    if (!(model && model.photos)) this.load()
  }

  load() {
    let id = this.props.match.params.id
    api("model/photos",{
      id: id,
      skip: 0, 
      limit: 20
    }).then((res) => {    
      this.props.modelLoaded(res,id,"photos")
      setTimeout(()=>{
        this.setState({loaded: true})  
      }, 0)
      
    })
  }

  render() {       
    let id = this.props.match.params.id
    let model = this.props.models[id]
    let photos = model && model.photos || false
    return (
      <div>
        <Header page='photo' id={id} />
        <main id="main">
          <div class="banner">
            <div class="video-block">
              <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/668nUCeBHyY?rel=0&amp;showinfo=0" 
                frameBorder="0" 
                allow="autoplay; encrypted-media" 
                allowFullScreen></iframe>
            </div>
            <div class="chat-block">
              <div class="chat-bg"></div>
              <div class="chat-header">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="credit">1 credit /minute</span>
                  <a href="#" class="btn btn-secondary">love</a>
                </div>
              </div>
              <div class="chat-body">
                <ul class="chat-list">
                  <li>
                    <div class="chat-bubble sent">
                      <span class="text">to what countries can I send wires from balance in payoneer?</span>
                      <span class="delivery-status">
                        <time datetime="22:18" class="sent-time">22:18</time>
                        <span class="status">
                          <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15"><path fill="#4FC3F7" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
                        </span>
                      </span>
                    </div>
                    <div class="chat-bubble sent">
                      <span class="text">because otherwise I wire the extra money to my company and then wire, so its a delay, this would not hurt  the payees and current payment plans</span>
                      <span class="delivery-status">
                        <time datetime="22:18" class="sent-time">22:18</time>
                        <span class="status">
                          <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15"><path fill="#4FC3F7" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
                        </span>
                      </span>
                    </div>
                  </li>
                  <li>
                    <time datetime="2018/03/29" class="date">3/29/2018</time>
                  </li>
                  <li>
                    <div class="chat-bubble sent">
                      <span class="text">hi Pearl</span>
                      <span class="delivery-status">
                        <time datetime="22:18" class="sent-time">22:18</time>
                        <span class="status">
                          <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15"><path fill="#4FC3F7" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
                        </span>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div class="chat-bubble received">
                      <span class="text">Please email client services they would know</span>
                      <span class="delivery-status">
                        <time datetime="22:18" class="sent-time">22:18</time>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div class="chat-bubble sent">
                      <span class="text">they told me to talk to you</span>
                      <span class="delivery-status">
                        <time datetime="22:18" class="sent-time">22:18</time>
                        <span class="status">
                          <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15"><path fill="#4FC3F7" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
                        </span>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div class="chat-bubble sent">
                      <span class="text">and I would feel better ifyou help :)</span>
                      <span class="delivery-status">
                        <time datetime="22:18" class="sent-time">22:18</time>
                        <span class="status">
                          <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15"><path fill="#4FC3F7" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
                        </span>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="chat-footer">
                <span class="smiley">
                  <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path opacity=".45" fill="#263238" d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"></path></svg>
                </span>
                <div class="form-group">
                  <textarea class="form-control" cols="30" rows="10" placeholder="Type a message"></textarea>
                </div>
                <span class="voice">
                  <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#263238" fill-opacity=".45" d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"></path></svg>
                </span>
              </div>
            </div>
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
      logged: !!state.session.user,
      user: state.session.user,
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