import React from 'react';
import { connect } from 'react-redux'
// import FacebookLogin from 'react-facebook-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { Link, Redirect } from 'react-router-dom';

import config from 'src/config'
import api2 from 'src/actions/api'
import api from 'src/helpers/api'

import queryString from 'query-string';

import { getStorageSid } from 'src/helpers/session'

import Footer from './footer'

import img28 from 'assets/images/img28.jpg'

import errors from 'src/constants/errors'

class Login extends React.Component {

  initialState = {
    mode: "facebook"
  }

  state = this.initialState

  componentWillMount() {
    this.setState({
      name: "",
      email: "",
      password: "",
      urlname: "",
      confirm_password: "",
      password_matched: true,
      resetToken: ""
    })

    const params = new URLSearchParams(this.props.location.search)
    const email = params.get('email')
    const token = params.get('token')
    const resetToken = params.get('passwordtoken')

    if (email && token) {
      api("confirmation",{email: email, token: token}).then(this.handleResponse).catch(this.handleError)
      return
    }

    if (resetToken) {
      this.setState({
        mode: "confirmPassword",
        resetToken: resetToken,
      })
    }

    let sid = getStorageSid()
    if (sid) {
      this.setState({loggingIn: true})
      api("auth/sid",{sid}).then(this.handleResponse).catch(this.handleError)
    }
  }

  fbClick = (e) => {
    
  }

  handleResponse = (res) => {
    if (this.props.user) return;
    this.setState({loggingIn: false})
    if (res && res.user && res.sid) {
      this.props.authSuccess(res)
    } else {
      throw new Error(res && res.error || 500)
    }
  }

  handleError = (err) => {
    let code = parseInt(err.message.replace("Error: ",""))
    if (code === errors.EMAIL_VERIFY) {
      this.setState({mode: "pendingVerify"})
    } else if (code == errors.INVALID_VERIFICATION) {
      this.setState({mode: "failedVerify"})
    } else if (code == errors.PENDING_RESET_PASSWORD) {
      this.setState({mode: "confirmPassword"})
    }
    this.setState({errCode: code})
  }

  fbResponse = (res) => {
    if (res.accessToken && !this.state.loggingIn && !this.props.user) {
      this.setState({loggingIn: true})
      api("auth/facebook",{token: res.accessToken})
        .then(this.handleResponse).catch(this.handleError)
    } else {
      console.log("fbResponse",res)
    }
  }

  setMode = (e,mode) => {
    e && e.preventDefault()
    this.setState({mode})
  }

  signup = (e) => {
    e && e.preventDefault()
    let data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }
    this.setState({loggingIn: true})
    api("auth/signup",data)
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  login = (e) => {
    e && e.preventDefault()
    let data = {
      email: this.state.email,
      password: this.state.password
    }
    this.setState({loggingIn: true})
    api("auth/login",data)
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  resend = (e) => {
    e && e.preventDefault()
    const { email } = this.state
    api("resend-verification", {email: email})
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  forgotPassword = (e) => {
    e && e.preventDefault()
    const { email } = this.state
    api("forgot-password", {email: email})
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  resetPassword = (e) => {
    const {password, confirm_password, resetToken} = this.state
    const confirm_status = password == confirm_password
    this.setState({
      password_matched: confirm_status
    })
    if (password !== "" && confirm_status) {
      api("reset-password", {
        token: resetToken,
        password: password,
      }).then(this.handleResponse)
        .catch(this.handleError)
    }
  }

  modelSignup = (e) => {
    e && e.preventDefault()
    let data = {
      name: this.state.name,
      urlname: this.state.urlname,
      email: this.state.email,
      password: this.state.password,
      isModel: true
    }
    this.setState({loggingIn: true})
    api("auth/signup",data)
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const { mode } = this.state
    return (
      <div>
        <header id="header" class="login-page">
          <div class="container d-flex align-items-center flex-wrap justify-content-between">
            <div class="profile-name">
              <a class="text-white" href="#">
                <span class="first-letter">j</span>unefox
              </a>
            </div>
            <a href="#" class="btn btn-default" onClick={e => this.setMode(e,"facebook")}>Sign in</a>
            <div class="right-nav ml-sm-auto">
              <ul>
                <li>
                  <a href="#"><i class="icon-encounters"></i>Encounters</a>
                </li>
                <li>
                  <Link to="/discover">
                    <i class="icon-globe-o"></i>People nearby
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <main id="main">
          <div class="login-section">
            <div class="container">
              <div class="login-box">
                <div class="left-column column">
                  <img class="img-fluid" src={img28} alt="image description" />
                </div>
                <div class="right-column column">
                  {this.state.mode == 'facebook' &&
                    <div class="sign-info d-flex">
                      <div class="user-counter mt-auto">395,804,680</div>
                      <span class="text">people have already joined, jump in!</span>
                      <FacebookLogin
                        appId={config.fb.appId}
                        autoLoad={false}
                        scope={config.fb.scope}
                        version={config.version}
                        onClick={this.fbClick}
                        callback={this.fbResponse}
                        render={fbProps =>
                          <div>
                            {!fbProps.isSdkLoaded &&
                              <div>loading...</div>
                            }
                            {fbProps.isProcessing &&
                              <div>Authenticating...</div>
                            }
                            {fbProps.isSdkLoaded && !fbProps.isProcessing &&
                              <a href="#" class="btn btn-lg btn-secondary" onClick={fbProps.onClick}>
                                <i class="icon-facebook2"></i>Sign in via Facebook
                              </a>
                            }
                          </div>
                        }
                        />
                      <span class="assurance">We never post on your behalf.</span>
                      <div class="model-login mt-2">
                        <span class="title">Are you model? <a href="#" onClick={e => this.setMode(e, 'modelSignup')}>Click Here</a></span>
                      </div>
                      <div class="other-option mt-auto">
                        <span class="title">Other sign in options</span>
                        <span class="login-email" onClick={e => this.setMode(e,'login')}><a href="#">Login with E-mail</a></span>
                      </div>
                    </div>
                  }
                  {this.state.mode == 'login' && 
                    <form class="login-form d-block" onSubmit={this.login}>
                      <h2>Login with email</h2>
                      <div class="form-group">
                        <input
                          type="email"
                          class="form-control form-control-lg"
                          placeholder="Email"
                          name="email"
                          value={this.state.email}
                          onChange={this.handleChange}
                          required
                         />
                      </div>
                      <div class="form-group">
                        <input
                          type="password"
                          class="form-control form-control-lg"
                          placeholder="Password"
                          name="password"
                          value={this.state.password}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                      {this.state.errCode == errors.BAD_CREDENTIALS && <div>wrong email or password</div>}
                      {this.state.errCode == errors.EMAIL_VERIFY && <div>Please verify your email address.</div>}
                      <button type="submit" class="btn btn-lg btn-secondary justify-content-center">Login</button>
                      <span class="alternate" onClick={e => this.setMode(e,'signup')}>
                        Not a member?
                        <a href="#" class="ml-1">Register with Email</a>
                      </span>
                      <a class="alternate" href="#" onClick={e => this.setMode(e,'forgotPassword')}>Forgot password?</a>
                      <span class="note">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed aliquam beatae libero, cum labore voluptates, maxime magni a consequuntur facere aliquid. Libero expedita magnam nihil deserunt <a href="#">privacy</a> culpa magni deleniti possimus.</span>
                    </form>
                  }

                  {this.state.mode == 'signup' && 
                    <form class="signup-form d-block" onSubmit={this.signup}>
                      <h2>Signup with email</h2>
                      <div class="form-group">
                        <input
                          type="text"
                          class="form-control form-control-lg"
                          placeholder="Name"
                          name="name"
                          value={this.state.name}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                      <div class="form-group">
                        <input
                          type="email"
                          class="form-control form-control-lg"
                          placeholder="Email"
                          name="email"
                          value={this.state.email}
                          onChange={this.handleChange}
                          required
                         />
                      </div>
                      <div class="form-group">
                        <input
                          type="password"
                          class="form-control form-control-lg"
                          placeholder="Password"
                          name="password"
                          value={this.state.password}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                      <button type="submit" class="btn btn-lg btn-secondary justify-content-center">Login</button>
                      <span class="alternate" onClick={e => this.setMode(e,'login')}>Already a member? <a href="#">Login with Email</a></span>
                    </form>
                  }

                  {this.state.mode == 'modelSignup' && 
                    <form class="model-signup-form d-block" onSubmit={this.modelSignup}>
                      <h2>Model Signup</h2>
                      <div class="form-group row">
                        <input
                          type="text"
                          class="form-control form-control-lg"
                          placeholder="Name"
                          name="name"
                          value={this.state.name}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                      <div class="form-group row">
                        <label for="input-urlname" class="col-5 pt-3 pb-3">junefox.com/model/</label>
                        <input
                          id="input-urlname"
                          type="text"
                          class="form-control form-control-lg col-7"
                          placeholder="Url name"
                          name="urlname"
                          value={this.state.urlname}
                          onChange={this.handleChange}
                          required
                        />
                      </div>                   
                      {this.state.errCode == errors.URLNAME_TAKEN && 
                        <div>This url name already registered</div>
                      }
                      <div class="form-group row">
                        <input
                          type="email"
                          class="form-control form-control-lg"
                          placeholder="Email"
                          name="email"
                          value={this.state.email}
                          onChange={this.handleChange}
                          required
                         />
                      </div>
                      {this.state.errCode == errors.EMAIL_TAKEN && 
                        <div>Email already exists</div>
                      }
                      <div class="form-group row">
                        <input
                          type="password"
                          class="form-control form-control-lg"
                          placeholder="Password"
                          name="password"
                          value={this.state.password}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                      <button type="submit" class="btn btn-lg btn-secondary justify-content-center">Signup</button>
                    </form>
                  }
                  {(mode == "pendingVerify" || mode == "failedVerify") &&
                    <div>
                      {this.state.errCode == errors.INVALID_VERIFICATION ?
                        <div>Your verification link is no longer valid or expired.</div>
                      : 
                        <div>
                          <div>We've already sent a verification link to your email address,</div>
                          <div>Please confirm your email address to complete signup.</div>
                        </div>
                      }
                      <div class="mt-4">
                        <span class="alternate" onClick={e => this.setMode(e,'emailConfirm')}>Didn't get it? <a href="#">Resend</a></span>
                      </div>
                      <div class="mt-4">
                        <span class="alternate" onClick={e => this.setMode(e,'login')}><a href="#">Login with Email</a></span>
                      </div>
                    </div>
                  }
                  {mode == "emailConfirm" &&
                    <form class="signup-form d-block" onSubmit={this.signup}>
                      <h2>Your email address</h2>
                      <div class="form-group">
                        <input
                          type="text"
                          class="form-control form-control-lg"
                          placeholder="Email"
                          name="email"
                          value={this.state.email}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                      {this.state.errCode == errors.BAD_CREDENTIALS && <div>User not exist, please signup</div>}
                      <span onClick={e => this.resend(e)} class="btn btn-lg btn-secondary justify-content-center">Resend</span>
                      <span class="alternate" onClick={e => this.setMode(e,'login')}><a href="#">Login with Email</a></span>
                    </form>
                  }
                  {mode == "forgotPassword" &&
                    <form class="signup-form d-block" onSubmit={this.signup}>
                    <h2>Your email address</h2>
                    <h5 class="note">We will send password reset link to your email.</h5>
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control form-control-lg"
                        placeholder="Email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        required
                      />
                    </div>
                    {this.state.errCode == errors.BAD_CREDENTIALS && <div>User not exist, please signup</div>}
                    <span onClick={e => this.forgotPassword(e)} class="btn btn-lg btn-secondary justify-content-center">Reset</span>
                    <span class="alternate" onClick={e => this.setMode(e,'login')}><a href="#">Login with Email</a></span>
                  </form>
                  }
                  {mode == "confirmPassword" &&
                    <div class="d-flex justify-content-center">
                      {this.state.errCode == errors.PENDING_RESET_PASSWORD ?
                        <div>
                          <div>We've already sent a verification link to your email address,</div>
                          <div>Please visit your email inbox to reset your password.</div>
                          <div class="mt-4">
                            <span class="alternate" onClick={e => this.setMode(e,'login')}><a href="#">Login with Email</a></span>
                          </div>
                        </div>
                      :
                        <form class="signup-form d-block col">
                          <div class="form-group">
                            <input
                              type="password"
                              class="form-control form-control-lg mb-2"
                              placeholder="New Password"
                              name="password"
                              value={this.state.password}
                              onChange={this.handleChange}
                              required
                            />
                            <input
                              type="password"
                              class="form-control form-control-lg"
                              placeholder="Confirm Password"
                              name="confirm_password"
                              value={this.state.confirm_password}
                              onChange={this.handleChange}
                              required
                            />
                            <div>
                              {!this.state.password_matched &&
                                <span class="note">Password doesn't match</span>
                              }
                            </div>
                          </div>
                          <div class="form-group">
                            {this.state.errCode == errors.EXPIRED_RESET_PASSWORD ? 
                              <div>
                                <span class="note">Your password reset link has been expired or no longer exists, please try to resend.</span>
                                <span onClick={e => this.setMode(e,'forgotPassword')} class="btn btn-lg btn-secondary justify-content-center">Resend</span>
                              </div>
                            : 
                              <div>
                                <span onClick={e => this.resetPassword(e)} class="btn btn-lg btn-secondary justify-content-center">Update Password</span>
                                <span class="alternate" onClick={e => this.setMode(e,'login')}><a href="#">Login with Email</a></span>
                              </div>
                            }
                          </div>
                        </form>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer dark={false} />
      </div>
    )
  }
}

export default connect(
  function (state) {
    return {
      logged: !!state.session.user,
      user: state.session.user,
      sid: state.api.auth_sid || state.api.initial,
      facebook: state.api.auth_facebook || state.api.initial,
    };
  }, {
    api: api2,
    authSuccess: (data) => {
      return {
        type: "auth_success",
        data: data
      }
    }
  })(Login)
