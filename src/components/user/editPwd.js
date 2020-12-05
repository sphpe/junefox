import React from "react"
import api from 'src/helpers/api'
import img11Icon from 'assets/images/img11.jpg'
import constants from 'src/constants/validation'
import { store } from 'src/store';

export default class PwdModal extends React.Component {

  initialState = {
    password: '',
    newPassword: '',
    confirmPassword: '',     
    loading: false,
    error: '',
    errorOldPwd: '',
    errorNewPwd: '',
    errorConfirmPwd: '',
    name: ''
  }

  componentWillMount() {    
    this.setState(this.initialState)
    this.setState({name: store.getState().session.user.name})
  }

  onClose = e => {
    this.props.close && this.props.close(e)
  }

  validateForm(){
    let formIsValid = true

    if(!(this.state.errorOldPwd.trim()=="" && this.state.errorNewPwd.trim()=="" && this.state.errorConfirmPwd.trim()=="")){
      formIsValid = false
    }
    if(!this.state.password){
      this.setState({errorOldPwd:'*Please enter old password.'})
      formIsValid = false     
    }
    
    if(!this.state.newPassword){
      this.setState({errorNewPwd:'*Please enter new password.'})
      formIsValid = false       
    }
    
    if(!this.state.confirmPassword){
      this.setState({errorConfirmPwd:'*Please enter confirm password.'})
      formIsValid = false       
    }

    return formIsValid
  }

  handleChange = (e) => {      
    const { name, value } = e.target
    this.setState({ [name]: value })
    switch(name){
      case 'password':
        if(value.toString().length < constants.MIN_PWD_LENGTH || value.toString().length > constants.MAX_PWD_LENGTH){
          this.setState({errorOldPwd:'*Invalid length of old password.'})           
        }
        else{
          this.setState({errorOldPwd:''})  
        }
      break
      case 'newPassword':
        if (!value.match(/^.*(?=.{6,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&!^*]).*$/)) {
          this.setState({errorNewPwd:'*Password must at least 6 characters, 1 special character, 1 number, 1 lowercase, 1 uppercase letter.'})
        }
        else{
          this.setState({errorNewPwd:''})
        }
      break
      case 'confirmPassword':
        if(this.state.newPassword != value){
          this.setState({errorConfirmPwd:'*Invalid confirm password.'})          
        }
        else{
          this.setState({errorConfirmPwd:''}) 
        }
      break
    }
  }

  handleSubmit = (e) => {       
    e.preventDefault()

    // stop here if form is invalid
    if(!this.validateForm())
      return

    this.setState({ loading: true })
    this.setState({ error: '' })

    let data = {      
      password: this.state.password,
      newPassword: this.state.newPassword
    }
    
    api("user/updatePwd",data)
      .then(    
        res => {
          if(res.ok != 1){
            this.setState({ error: res.error.toString(), loading: false }) 
          }            
          else{
            this.setState(this.initialState)
            this.onClose(e)   
          }               
        },
        error => this.setState({ error: error.toString(), loading: false }))       
  }

  render() {
    const{ password, newPassword, confirmPassword, loading, error, errorOldPwd, errorNewPwd, errorConfirmPwd, name } = this.state
    return (
       
      <div className="modal-content" onClick= {e => { e.stopPropagation()}}>
        <div class="profile-name-holder row align-items-center">
          <div class="col-3 col-sm-4 col-lg-3 text-right">
            <div class="avatar">
              <a href="#">
                <img src={img11Icon} alt="image description" width="47" height="47" />
              </a>
            </div>
          </div>
          <div class="name-holder col-9 col-sm-8 col-lg-9">
            <span class="username">{name}</span>
            <a href="#" class="edit-picture">Edit Profile Photo</a>
          </div>
        </div>
        <form class="profile-form" name="form" onSubmit={this.handleSubmit}>              
          <div className={'form-group row'}>
            <label htmlFor="password" className="col-sm-4 col-lg-3 col-form-label">Old Password</label>
            <div class="col-sm-8 col-lg-9">
              <input type="password" className="form-control" name="password" value={password}
              onChange={e => { this.handleChange(e) }}
              />              
            </div>             
            {errorOldPwd && <div className={'errorMsg offset-sm-4 offset-lg-3 col-sm-8 col-lg-9'}>{errorOldPwd}</div>}
          </div>
          <div className={'form-group row'}>
            <label htmlFor="newPassword" className="col-sm-4 col-lg-3 col-form-label">New Password</label>
            <div class="col-sm-8 col-lg-9">
              <input type="password" className="form-control" name="newPassword" value={newPassword}              
              onChange={e => { this.handleChange(e) }} />               
            </div>            
            {errorNewPwd && <div className={'errorMsg offset-sm-4 offset-lg-3 col-sm-8 col-lg-9'}>{errorNewPwd}</div>}
          </div>
          <div className={'form-group row'}>
            <label htmlFor="confirmPass" className="col-sm-4 col-lg-3 col-form-label">Confirm New Password</label>
            <div class="col-sm-8 col-lg-9">
              <input type="password" className="form-control" name="confirmPassword" value={confirmPassword}               
              onChange={e => { this.handleChange(e) }} />               
            </div>
            {errorConfirmPwd && <div className={'errorMsg offset-sm-4 offset-lg-3 col-sm-8 col-lg-9'}>{errorConfirmPwd}</div>}            
          </div>
        
          <div className="row justify-content-end pt-2 pt-xl-3">
            <div className="col-md-11 col-lg-9 d-flex flex-column flex-sm-row align-items-center justify-content-between pr-md-5">
              <button className="btn btn-primary mb-2 mb-sm-0" disabled={loading}>Submit</button>
              {loading &&
                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
              }                  
            </div>
          </div>
            
          <div className="row justify-content-end pt-3 pt-xl-4">
            {error && <div className={'errorMsg offset-sm-4 offset-lg-3 col-sm-8 col-lg-9'}>{error}</div>}
          </div>
        </form>              
    
      </div>
     
    );
  }
}