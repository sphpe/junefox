import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux'

import config from 'src/config'

import youtubeIcon from 'assets/images/youtube.png'
import plusIcon from 'assets/images/plus.svg'
import likeIcon from 'assets/images/facebook-like.png'
import tweetIcon from 'assets/images/tweet.png'

class Component extends React.Component {

  toggleProfileDropdown = (e) => {
    e && e.preventDefault()
    let wasActive = document.body.className.indexOf("drop-active") != -1;
    if (wasActive) {
      document.body.className = document.body.className.replace("drop-active","").trim()
    } else {
      document.body.className += " drop-active";
    }   
    e.stopPropagation()
    e.preventDefault()
  }

  toggleMenu = (e) => {    
    let wasActive = document.body.className.indexOf("sidebar-active") != -1;
    if (wasActive) {
      document.body.className = document.body.className.replace("sidebar-active","").trim()
    } else {
      document.body.className += " sidebar-active";
    }    
    e.stopPropagation()
    e.preventDefault()
  }

  render() {        
    return (
      <footer class={"login-footer "+(this.props.dark ? "dark" : "")}>
        <div class="container">
          <ul class="app-links">
            <li><a href="#"><i class="icon-apple"></i>App Store</a></li>
            <li><a href="#"><i class="icon-play"></i>Google Play</a></li>
          </ul>
          <div class="bottom-section">
            <ul class="footer-link">
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Mobile</a>
              </li>
              <li>
                <a href="#">Terms</a>
              </li>
              <li>
                <a href="#">Privacy</a>
              </li>
              <li>
                <a href="#">Quick links</a>
              </li>
              <li>
                <a href="#">Help</a>
              </li>
              <li>
                <a href="#">Press</a>
              </li>
            </ul>
            <div class="row align-items-center">
              <div class="col-sm-8">
                <ul class="social-links">
                  <li>
                    <a href="#">
                      <img src={youtubeIcon} width="85" alt="Subscribe our Channel" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src={plusIcon} width="32" alt="Follow on Google Plus" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src={likeIcon} width="80" alt="Like on Facebook" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src={tweetIcon} width="61" alt="Follow on Twitter" />
                    </a>
                  </li>
                  <li>
                    <a href="#" class="ig-link" target="_blank">
                      <svg width="22" height="22">
                        <defs>
                          <linearGradient id="instagram-color" x1="12.9%" x2="87.1%" y1="103%" y2="-3%">
                            <stop stopColor="#FFB900" offset="0%"></stop>
                            <stop stopColor="#9100EB" offset="100%"></stop>
                          </linearGradient>
                        </defs>
                        <g fill="none" fillRule="evenodd">
                          <path fill="url(#instagram-color)" d="M22 19.3c0 1.5-1.2 2.7-2.8 2.7H3c-2 0-3-1.2-3-2.8V3c0-2 1.2-3 2.8-3H19c2 0 3 1.2 3 2.8v16.5z"></path><path fill="#FFF" d="M3 7c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4V7zm1 0c0-1.7 1.3-3 3-3h8c1.7 0 3 1.3 3 3v8c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7zm7 8c-2.3 0-4-1.7-4-4s1.7-4 4-4 4 1.7 4 4-1.7 4-4 4zm0-7c-1.6 0-3 1.4-3 3s1.4 3 3 3 3-1.4 3-3-1.4-3-3-3zm4.4-.5c.5 0 1-.4 1-1 0-.4-.5-.8-1-.8s-1 .4-1 1c0 .4.5.8 1 .8z"></path>
                        </g>
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-sm-4 text-right">
                <span class="copyright">2018 <sup>&copy;</sup> JuneFoxx</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

export default connect(
  function (state) {
    return {
      logged: !!state.session.user,
      user: state.session.user
    };
  }, {})(Component)