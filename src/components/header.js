import React from 'react';
import PropTypes from 'prop-types'
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux'
import Modal from './user/profile';
import config from 'src/config';

import { updateSearchAction } from 'store/action-creators/search'

class Component extends React.Component {

  state = {
    isModalShowing: false
  }

  static propTypes = {
    searchKey: PropTypes.string.isRequired,
    updateSearch: PropTypes.func.isRequired,
  }

  showModal = e => {
    this.setState({
      isModalShowing: !this.state.isModalShowing
    });
  };

  toggleProfileDropdown = (e) => {
    e && e.preventDefault()
    let wasActive = document.body.className.indexOf("drop-active") != -1;
    if (wasActive) {
      document.body.className = document.body.className.replace("drop-active", "").trim()
    } else {
      document.body.className += " drop-active";
    }
    e.stopPropagation()
    e.preventDefault()
  }

  toggleMenu = (e) => {
    let wasActive = document.body.className.indexOf("sidebar-active") != -1;
    if (wasActive) {
      document.body.className = document.body.className.replace("sidebar-active", "").trim()
    } else {
      document.body.className += " sidebar-active";
    }
    e.stopPropagation()
    e.preventDefault()
  }

  onSearch = (e) => {
    const { updateSearch } = this.props
    updateSearch(e.target.value)
  }

  render() {
    const { searchKey } = this.props
    return (
      <div>
        <header id="header">
          <div class="container d-flex align-items-lg-center justify-content-between">
            {false && <a href="#" class="menu-opener sidebar-opener" onClick={this.toggleMenu}><span>Menu</span></a>}
            <div class="profile-name"><a href="#"><span class="first-letter">j</span>unefox</a></div>
            <div class="search-form d-none d-lg-block">
              <div class="form-group">
                <i class="icon-search-thick"></i>
                <input class="form-control" type="search" value={searchKey} onChange={this.onSearch} placeholder="Search" />
              </div>
            </div>
            <nav id="nav">
              <ul>
                <li class="search d-lg-none"><a href="#"><i class="icon-search"></i><span class="sr-only">Search</span></a></li>
                <li><Link to="/discover"><i class="icon-compass"></i><span class="sr-only">Explore</span></Link></li>
                <li class="notification"><a href="#"><i class="icon-heart"></i><span class="sr-only">Notification</span></a></li>
                <li>
                  <a href="#" class="drop-opener" onClick={e => { this.showModal(e); }}>
                    <i class="icon-user"></i>
                    <span class="sr-only">Profile</span>
                  </a>
                </li>
              </ul>
            </nav>
            <div class="profile-drop">
              <ul>
                <li><a href="#"><i class="icon icon-user"></i>My Profile</a></li>
                <li><a href="#"><i class="icon icon-people"></i>Fans</a></li>
                <li><a href="#"><i class="icon icon-globe"></i>Following</a></li>
                <li><a href="#"><i class="icon icon-headset"></i>My Referrals</a></li>
                <li><a href="#"><i class="icon icon-preferences"></i>My Settings</a></li>
                <li onClick={this.props.logout}><i class="icon icon-exit"></i>Logout</li>
              </ul>
            </div>
          </div>
        </header>
        <nav class="sidebar-nav">
          <div class="top-sidebar">
            <a href="#" class="menu-opener sidebar-opener"><span>Menu</span></a>
            <div class="profile-name"><a href="#"><span class="first-letter">j</span>unefox</a></div>
          </div>
          <ul>
            <li class="active"><Link to={"/model/" + this.props.id}>Profile</Link></li>
            <li><Link to={"/model/" + this.props.id}>Model</Link></li>
            <li><Link to={"/model/" + this.props.id + "/photo"}>Photos</Link></li>
            <li><Link to={"/model/" + this.props.id + "/video"}>Videos</Link></li>
            <li><a href="#" class="sidebar-opener" data-toggle="modal" data-target="#profileSettingModal">Setting</a></li>
          </ul>
        </nav>

        {this.state.isModalShowing &&
          <Modal
            className="modal"
            close={this.showModal}
            logout={this.props.logout} />
        }
      </div>
    )
  }
}

const mapStateToProps = ({ session, search }) => ({
  logged: session.user,
  user: session.user,
  searchKey: search.searchKey,
})

const mapDispatchToProps = ({
  logout: (e) => ({type : "auth_logout"}),
  updateSearch: updateSearchAction,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component)
