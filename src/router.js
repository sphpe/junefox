import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

import Login from './components/login'
import Discover from './components/discover'
import ModelLanding from './components/model/index'
import Followings from './components/model/followings'

import UserFans from './components/user/fans'
import UserFollowing from './components/user/following'
import UserProfile from './components/user/profile'
import UserReferrals from './components/user/referrals'


class Router extends React.Component {

  hidePopups = (e) => {
    document.body.className = ""
  }

  render() {
    let user = this.props.user
    let pathname = this.props.location.pathname
    if (user && (pathname == "/" || pathname == "/confirmation" || pathname == "/reset-password")) {
      let to = user.isModel && user.urlname ? "/model/"+user.urlname : "/discover/recent";
      return <Redirect to={to} />
    }
    // let defaultComponent = user && user.isModel 
    return (
      <div id="wrapper" onClick={this.hidePopups}>
        {!user &&
          <Switch>
            <Route path="/" component={Login} />
          </Switch>
        }
        {user &&
          <Switch>
            <Route path="/model/:id" component={ModelLanding} />
            <Route path="/followings" component={Followings} />
            <Route path="/discover/:type" component={Discover} />
            <Route path="/" component={Discover} />
          </Switch>
        }
      </div>
    )
  }
}

export default withRouter(connect(
  function (state) {
    return {
      logged: !!state.session.user,
      user: state.session.user
    };
  }, {})(Router))
