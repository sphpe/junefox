import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import moment from 'moment'
import Dropzone from 'react-dropzone'

import api from 'src/helpers/api'

import instagrammIcon from 'assets/images/instagram-text.svg'
import facebookIcon from 'assets/images/facebook.svg'
import crossDarkGrey from 'assets/images/cross-darkgrey.svg'


class Component extends React.Component {
  
  state = {
    images: [],
    preview: []
  }

  componentWillMount() {
    document.body.className += " modal-open"
  }

  componentWillUnmount() {
    document.body.className = document.body.className.replace("modal-open","")
  }

  addPreview = (file) => {

  }

  onDrop = (files, rejectedFiles) => {
    let uploaders = files.map(file => {
      if (this.state.preview.indexOf(file.preview) != -1) return;
      let type = file.type.split("/")[0]
      let size = file.size / 1024 / 1024;
      size = size.toFixed(1);
      this.state.preview.push({"id": file.preview, "contentId" : "", "request": null, "progress": 0, "size": size, "name": file.name});
      this.setState({
        preview: this.state.preview,
        progress: 0,
        type: type,
      })
      let request = api("model/upload",{
        file: file,
        type: this.props.type,
        filetype: type,
      }, true,this.progressUpdate).then(res => {
        let contentId = this.props.type == "timeline" ? res.contentId : res;
        this.state.preview[this.state.preview.length - 1].contentId = contentId;
        this.setState({preview: this.state.preview});
        let id = this.props.user.urlname;
        let profile = this.props.models[id].profile        
        switch (type) {
          case "image":
            profile.photo.push(contentId);
            this.props.modelLoaded(profile,this.props.userId,"profile");

            break;
          case "video":
            profile.video.push(contentId)
            this.props.modelLoaded(profile,this.props.userId,"profile")    
            break;            
        }
        if (this.props.type == "timeline") {
          let timeline = this.props.models[id].timeline
          if (timeline) {
            timeline.unshift(res)
            this.props.modelLoaded(timeline,this.props.userId,"timeline")    
          }
        }
      })

      this.state.preview[this.state.preview.length - 1].request = request
      this.setState({preview: this.state.preview});
    })
  }

  progressUpdate = (e, p) => {
    this.state.preview[this.state.preview.length - 1].progress = p;
    this.setState({preview: this.state.preview})
  }

  removeUpload = (contentId, e) => {
    e && e.preventDefault();
    for(let i = 0; i < this.state.preview.length; i++) {
      if(this.state.preview[i].contentId == contentId) {
        this.state.preview.splice(i, 1);
        this.setState({preview: this.state.preview})
      }
    }
    let id = this.props.user.urlname;
    let photo = this.props.models[id].profile.photo;
    photo.splice(photo.indexOf(contentId),1);
    this.save({target: {
      name: "photo",
      value: photo
    }})
  }

  save = (e) => {
    let field = e.target.name
    api("model/update", {
      key: field,
      value: e.target.value
    })
    let id = this.props.user.urlname;
    let profile = this.props.models[id].profile
    this.props.modelLoaded(profile,this.props.userId,"profile");
  }

  cancelUpload = (contentId, e) => {
    e.preventDefault();
    debugger;
  }

  preventEvent = (e) => {
    e.preventDefault();
  }
  render() {       
    switch (this.props.type) {
      case "photo":
        this.accept = "image/*"
        break;
      case "video":
        this.accept = "video/*"
        break;
      case "timeline":
        this.accept = "image/*, video/*"
        break;                
    }
    return (
      <div>
        <div class="modal-backdrop fade show"></div>
        <div class="modal fade show d-block" id="fileUploadModal" role="dialog" aria-labelledby="fileUploadModalLabel" aria-hidden="true" onClick={this.props.onClose}>
          <div class="modal-dialog" role="document">
            <div class="modal-content upload-lightbox" onClick={e => e.stopPropagation()}>
              <div class="file-uploader">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onClose}><span aria-hidden="true">×</span></button>
                <h2 class="modal-title" id="fileUploadModalLabel">Upload your content</h2>  
                <Dropzone onDrop={this.onDrop} className="dropzone needsclick dz-clickable" accept={this.accept}>
                  <div className="preview-images-container">
                    {this.state.preview.map((img)=>
                      <div className="preview-item" onClick={e => this.preventEvent(e)}>
                        <img src={img.id} key={img.id} class="upload-preview" />
                        <div className="item-details">
                          <span className="file-size">{img.size} MB</span>
                          {
                            img.progress != 100 ?
                            <div className="progress">
                              <div className="progress-bar" role="progressbar" style={{width: img.progress + '%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                            </div> : ""
                          }
                          <span className="file-name">{img.name}</span>
                        </div>
                        {
                          img.progress == 100 ?
                          <span className="closeIcon" onClick={e => this.removeUpload(img.contentId, e)}>
                            <img src={crossDarkGrey} width="12" alt="remove"/>
                          </span>
                          : ""
                        }
                      </div>
                    )}

                  </div>
                  {
                    this.state.preview.length == 0 ?
                    <div class="dz-message needsclick">
                      Drop files here or click to upload.
                    </div>:''
                  }
                </Dropzone>
                
                <Dropzone onDrop={this.onDrop} className="btn btn-primary" accept={this.accept}>Upload              
                </Dropzone>
                <span class="or">OR</span>
                <div class="row">
                  <div class="col-sm-auto mb-2 mb-sm-0">
                    <span class="link-import">
                      <a href="#">
                        <span class="text">Import from</span>
                        <span class="social-logo">
                          <img src={facebookIcon} height="18" alt="Facebook" />
                        </span>
                      </a>
                    </span>
                  </div>
                  <div class="col-sm-auto">
                    <span class="link-import">
                      <a href="#">
                        <span class="text">Import from</span>
                        <span class="social-logo">
                          <img src={instagrammIcon} height="25" alt="Instagram" />
                        </span>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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