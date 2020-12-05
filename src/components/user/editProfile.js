import React from "react";
import api from 'src/helpers/api';
import avatarPlaceholder from 'assets/images/profile-avatar-placeholder.png';
import constants from 'src/constants/validation'
import { getImage, getVideo } from 'src/helpers/images'

export default class ProfileModal extends React.Component {

  initialState = {
    name: '',
    username: '',
    website: '',
    email: '',
    phonenumber: '',
    gender: '0',
    bio: '',
    privateAccount: false,
    accountSuggestion: false,
    loading: false,
    error: '',
    errorName: '',
    errorUserName: '',
    errorWebsite: '',
    errorBio: '',
    errorPhoneNumber: '',
    avatar: ''
  }

  componentWillMount() {
    this.setState(this.initialState)
    this.load()
  }

  load() {    
    api("user/loadProfile",{
    }).then((res) => {
      this.setState({ name: res.name,
        username: res.username,
        website: res.website,
        email: res.email,
        phonenumber: res.phonenumber,
        gender: res.gender,
        bio: res.bio,
        privateAccount: res.privateAccount,
        accountSuggestion: res.accountSuggestion,
        avatar: res.avatar })        
    })
  }

  onClose = e => {
    this.props.close && this.props.close(e);
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    switch(name){
    case 'name':
      if(value.toString().length < constants.MIN_NAME_LENGTH || value.toString().length > constants.MAX_NAME_LENGTH){
        this.setState({errorName:'*Invalid length of name.'})       
      }
      else if (!value.match(/^[a-zA-Z ]*$/)) {
        this.setState({errorName:'*Please enter alphabet characters only.'}) 
      }
      else{
        this.setState({errorName:''})  
      }
    break
    case 'username':
      if(value.toString().length > constants.MAX_NAME_LENGTH){
        this.setState({errorUserName:'*Invalid length of name.'})       
      }      
      else{
        this.setState({errorUserName:''})  
      }
    break
    case 'website':
      if(value.toString().length > constants.MAX_WEBSITE_LENGTH){
        this.setState({errorWebsite:'*Invalid length of website url.'})       
      }
      else if (!value.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)) {
        this.setState({errorWebsite:'*Please enter valid url.'}) 
      }
      else{
        this.setState({errorWebsite:''})
      }
    break
    case 'bio':
      if(value.toString().length > constants.MAX_WEBSITE_LENGTH){
        this.setState({errorBio:'*Invalid length of bio.'})       
      }
      else{
        this.setState({errorBio:''})  
        }
      break
      case 'phonenumber':
        if (!value.match(/^[0-9]{10}$/)) {
          this.setState({errorPhoneNumber:'*Please enter valid mobile number.'}) 
        }
        else{
          this.setState({errorPhoneNumber:''})  
        }
      break
      default:
      break
    }
  }

  validateForm(name, value){
    
    let formIsValid = true
    switch(name){
      case 'name':
        if(!value){
          this.setState({errorName:'*Please enter name.'})
          formIsValid = false     
        }
        else if(this.state.errorName.trim()!="")
          formIsValid = false
      break
      case 'username':
        if(this.state.errorUserName.trim()!="")
          formIsValid = false
      break
      case 'website':
        if(this.state.errorWebsite.trim()!="")
          formIsValid = false
      break
      case 'bio':
        if(this.state.errorBio.trim()!="")
          formIsValid = false
      break
      case 'phonenumber':
        if(this.state.errorPhoneNumber.trim()!="")
          formIsValid = false
      break
    }

    return formIsValid

  }

  handleBlur = (e) => {
    const { name, value } = e.target
    
    if(!this.validateForm(name, value))
      return
     
    api("user/updateField",{        
      key: name,
      value: value
    }).then((res) => {
      if(res.ok != 1){
        this.setState({ error: res.error.toString() })
      }
    })
  }

  clickEditProfilePhoto = e => {
    this.refs.profileAvatarInput.click()
  }

  changeProfileAvatar = e => {
    let files = e.target.files
    if(files.length > 0) {
      let file = files[0]
      api("user/uploadavatar",{
        file: file
      }, true).then(res => {
        this.setState({avatar: res})
      })
    }
  }

  render() {
    const{ name, 
      username, 
      website, 
      bio, 
      email, 
      phonenumber, 
      gender, 
      privateAccount, 
      accountSuggestion,
      loading, 
      error,
      errorName,
      errorUserName,
      errorWebsite,
      errorBio,
      errorPhoneNumber } = this.state;
    return (
      <div className="modal-content" onClick= {e => { e.stopPropagation()}}>
        <div className="profile-name-holder row align-items-center">
          <div className="col-3 col-sm-4 col-lg-3 text-right">
            <div className="avatar">
              <a href="#">
                {
                  this.state.avatar == "" ?
                  <img src={avatarPlaceholder} alt="Profile Avatar" width="47" height="47" />
                  :<img src={getImage(this.state.avatar,"gallery")} alt="Profile Avatar" width="47" height="47"/>
                }
                
              </a>
            </div>
          </div>
          <div className="name-holder col-9 col-sm-8 col-lg-9">
            <span className="username">{name}</span>
            <a href="#" className="edit-picture" onClick={e => this.clickEditProfilePhoto(e)}>Edit Profile Photo</a>
            <input type="file" ref="profileAvatarInput" style={{display: "none"}} onChange={e => this.changeProfileAvatar(e)}/>
          </div>
        </div>

        <form className="profile-form" name="form">
          <div className={'form-group row'}>
            <label htmlFor="name" className="col-sm-4 col-lg-3 col-form-label">Name</label>
            <div class="col-sm-8 col-lg-9">
              <input type="text" className="form-control" name="name" value={name}
              onChange={e => this.handleChange(e)}               
              onBlur={e => this.handleBlur(e)}               
              />
            </div>
            {errorName && <div className={'errorMsg offset-sm-4 offset-lg-3 col-sm-8 col-lg-9'}>{errorName}</div>}
          </div>

          <div className={'form-group row'}>
            <label htmlFor="username" className="col-sm-4 col-lg-3 col-form-label">Username</label>
            <div class="col-sm-8 col-lg-9">
              <input type="text" className="form-control" name="username" value={username} 
              onChange={e => this.handleChange(e)}               
              onBlur={e => this.handleBlur(e)}
            />                
            </div>
            {errorUserName && <div className={'errorMsg offset-sm-4 offset-lg-3 col-sm-8 col-lg-9'}>{errorUserName}</div>}
          </div>

          <div className={'form-group row'}>
            <label htmlFor="website" className="col-sm-4 col-lg-3 col-form-label">Website</label>
            <div class="col-sm-8 col-lg-9">
              <input type="url" className="form-control" name="website" value={website} 
              onChange={e => this.handleChange(e)}               
              onBlur={e => this.handleBlur(e)}
            />
            </div>
            {errorWebsite && <div className={'errorMsg offset-sm-4 offset-lg-3 col-sm-8 col-lg-9'}>{errorWebsite}</div>}
          </div>

          <div className={'form-group row'}>
            <label htmlFor="bio" className="col-sm-4 col-lg-3 col-form-label">Bio</label>
            <div class="col-sm-8 col-lg-9">
              <textarea className="form-control" name="bio" value={bio} 
              onChange={e => this.handleChange(e)}               
              onBlur={e => this.handleBlur(e)}></textarea>
            </div>
            {errorBio && <div className={'errorMsg offset-sm-4 offset-lg-3 col-sm-8 col-lg-9'}>{errorBio}</div>}
          </div>
                        
          <div className="row justify-content-end">
            <div className="col-sm-8 col-lg-9">
              <strong className="form-title">Private Information</strong>
            </div>
          </div>

          <div className={'form-group row'}>
            <label htmlFor="email" className="col-sm-4 col-lg-3 col-form-label">Email</label>
            <div class="col-sm-8 col-lg-9">
              <input type="text" className="form-control" name="email"              
              value={email} readOnly />                   
            </div>
          </div>

          <div className={'form-group row'}>
            <label htmlFor="phonenumber" className="col-sm-4 col-lg-3 col-form-label">Phone Number</label>
            <div class="col-sm-8 col-lg-9">
              <input type="text" className="form-control" name="phonenumber" 
              onChange={e => this.handleChange(e)}
              onBlur={e => this.handleBlur(e)}
              value={phonenumber} />                  
            </div>
            {errorPhoneNumber && <div className={'errorMsg offset-sm-4 offset-lg-3 col-sm-8 col-lg-9'}>{errorPhoneNumber}</div>}
          </div>              

          <div className="form-group row">
            <label for="gender" className="col-sm-4 col-lg-3 col-form-label">Gender</label>
            <div className="col-sm-8 col-lg-9">
              <select className="custom-select" name="gender" value={gender}              
              onChange={e => this.handleChange(e)}
              onBlur={e => this.handleBlur(e)}>
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
            </div>
          </div>

          <div className="form-group row checkbox-row">
            <span className="col-sm-4 col-lg-3 label">Private Account</span>
            <div className="col-sm-8 col-lg-9 pr-4">
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input"                
                checked={privateAccount} onChange={e => this.handleChange(e)}
                onBlur={e => this.handleBlur(e)} />
                <label className="custom-control-label" for="privateAccount">When your account is private, only people you approve can see your photos and videos on Instagram. Your existing followers won't be affected</label>
              </div>
            </div>
          </div>
          <div className="form-group row checkbox-row">
            <span className="col-sm-4 col-lg-3 label">Similar Account Suggestions</span>
            <div className="col-sm-8 col-lg-9 pr-4">
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input"                
                checked={accountSuggestion} onChange={e => this.handleChange(e)}
                onBlur={e => this.handleBlur(e)} />
                <label className="custom-control-label" for="similarAccount">Include your account when recommending similar accounts people might want to follow. <a href="#" className="info">[?]</a></label>
              </div>
            </div>
          </div>

          <div className="row justify-content-end pt-2 pt-xl-3">
            <div className="col-md-11 col-lg-9 d-flex flex-column flex-sm-row align-items-center justify-content-between pr-md-5">
              <button className="btn btn-primary mb-2 mb-sm-0"               
              disabled={loading} onClick={e => this.onClose(e)}>Close</button>
              <span className="link-disable"><a href="#">Temporarily disable my account</a></span>
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
