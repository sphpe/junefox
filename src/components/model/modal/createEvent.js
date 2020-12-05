import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import moment from 'moment'
import Dropzone from 'react-dropzone'
import DatePicker from "react-datepicker";
import TimePicker from 'rc-time-picker';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';

import api from 'src/helpers/api'

import crossDarkGrey from 'assets/images/cross-darkgrey.svg'
import previewVideoThumb from 'assets/images/videopreview.png'

class Component extends React.Component {
  
  initialState = {
    images: [],
    video: [],
    trailer: [],
    preview: [],    
    step: 1,
    title: "",
    description: "",
    startDate: moment(),
    startTime: "00:00",
    endDate: moment(),
    endTime: "00:00",
    previewTrailer: []
  }

  componentWillMount() {
    document.body.className += " modal-open"
    this.setState(this.initialState)
  }

  componentWillUnmount() {
    document.body.className = document.body.className.replace("modal-open","")
  }

  onDrop = (files, rejectedFiles) => {
    let uploaders = files.map(file => {
      if (this.state.preview.indexOf(file.preview) != -1) return;
      let type = file.type.split("/")[0];
      let size = file.size / 1024 / 1024;
      size = size.toFixed(1);
      this.state.preview.push({
        "id": file.preview, 
        "contentId" : "", 
        "request": null, 
        "progress": 0, 
        "size": size, 
        "name": file.name,
        "type": type
      });
      this.setState({
        preview: this.state.preview,
        progress: 0,
        type: type
      })
      api("event/upload",{
        file: file,
        type: this.props.type,
        filetype: type
      }, true, this.progressUpdate).then(res => {
        let contentId = this.props.type == "timeline" ? res.contentId : res;
        this.state.preview[this.state.preview.length - 1].contentId = contentId;
        this.setState({preview: this.state.preview});
        if (type == "image") {
          this.state.images.push(res)
          this.setState({
            images: this.state.images
          })
        } else {
          this.state.video.push(res)
          this.setState({
            video: this.state.video
          })
        }
      })                  
    })
  }

  progressUpdate = (e, p) => {
    this.state.preview[this.state.preview.length - 1].progress = p;
    this.setState({preview: this.state.preview})
  }

  progressUpdateTrailer = (e, p) => {
    this.state.previewTrailer[this.state.previewTrailer.length - 1].progress = p;
    this.setState({previewTrailer: this.state.previewTrailer})
  }


  removeUpload = (contentId, e) => {
    e && e.preventDefault();
    for(let i = 0; i < this.state.preview.length; i++) {
      if(this.state.preview[i].contentId == contentId) {
        this.state.preview.splice(i, 1);
        this.setState({preview: this.state.preview})
      }
    }

    for(let i = 0; i < this.state.images.length; i++) {
      if(this.state.images[i] == contentId) {
        this.state.images.splice(i, 1);
        this.setState({images: this.state.images})
      }
    }

    for(let i = 0; i < this.state.video.length; i++) {
      if(this.state.video[i] == contentId) {
        this.state.video.splice(i, 1);
        this.setState({video: this.state.video})
      }
    }
  }

  removeUploadTrailer = (contentId, e) => {
    e && e.preventDefault();
    for(let i = 0; i < this.state.previewTrailer.length; i++) {
      if(this.state.previewTrailer[i].contentId == contentId) {
        this.state.previewTrailer.splice(i, 1);
        this.setState({previewTrailer: this.state.previewTrailer})
      }
    }

    for(let i = 0; i < this.state.trailer.length; i++) {
      if(this.state.trailer[i] == contentId) {
        this.state.trailer.splice(i, 1);
        this.setState({trailer: this.state.trailer})
      }
    }
  }

  onDropTrailer = (files, rejectedFiles) => {
    let file = files[0]
    
    if (this.state.previewTrailer.indexOf(file.preview) != -1) return;
    let type = file.type.split("/")[0]
    let size = file.size / 1024 / 1024;
    size = size.toFixed(1);
    this.state.previewTrailer.push({
      "id": file.preview, 
      "contentId" : "", 
      "request": null, 
      "progress": 0, 
      "size": size, 
      "name": file.name,
      "type": type
    })
    this.setState({
      previewTrailer: this.state.previewTrailer,
      progress: 0,
      type: type
    })
    api("event/upload",{
      file: file,
      type: "trailer",
      filetype: type
    }, true, this.progressUpdateTrailer).then(res => {
      this.state.trailer.push(res);
      this.setState({trailer: this.state.trailer})
      this.state.previewTrailer[this.state.previewTrailer.length - 1].contentId = res;
      this.setState({previewTrailer: this.state.previewTrailer});
    })                  
  }  

  handleDateChange = (date) => {
    if (date == null) {
      return;
    }
    this.setState({
      startDate: date
    });
  }  

  handleStartTimeChange = (value) => {
    let hours = value && value.format("HH") || "00"
    let mins = value && value.format("mm") || "00"
    this.state.startDate.set({hour: hours, minutes: mins})
    if(!this.checkValidation()) {
      return;
    }

    this.setState({
      startTime: value,
      startDate: this.state.startDate
    });    
  }  

  handleEndTimeChange = (value) => {
    let hours = value && value.format("HH") || "00"
    let mins = value && value.format("mm") || "00"
    this.state.endDate.set({hour: hours, minutes: mins})
    if(!this.checkValidation()) {
      return;
    }
    this.setState({
      endTime: value,
      endDate: this.state.endDate
    });
    
  }

  checkValidation() {
    let hours_s = this.state.startDate.format("HH") || "00";
    let mins_s = this.state.startDate.format("mm") || "00";

    let hours_e = this.state.endDate.format("HH") || "00";
    let mins_e = this.state.endDate.format("mm") || "00";
    if((parseInt(hours_s) > parseInt(hours_e))|| ((parseInt(hours_s) == parseInt(hours_e)) && (parseInt(mins_s)> parseInt(mins_e)))) {
      alert('Start time must be smaller than end time');
      return false;
    }

    if(this.state.title == "") {
      alert("Please input title!")
      return false;
    }

    return true;
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }   

  backStep = (e)=> {
    this.setState({
      step: this.state.step-1
    })
  }

  nextStep = (e)=> {
    if(!this.checkValidation()) {
      return;
    }

    this.setState({
      step: this.state.step+1
    })
  }

  create = (e) => {
    if (this.state.creating) return;
    let event = {
      title: this.state.title,
      description: this.state.description,
      startDate: this.state.startDate.valueOf(),
      endDate: this.state.endDate.valueOf(),
      images: this.state.images,
      video: this.state.video,
      trailer: this.state.trailer
    }
    this.setState({creating: true})
    api("event/create",event).then(res => {
      this.setState({creating: false})
      if (res && res._id) {
        this.props.eventCreated(this.props.user.urlname,res)  
        this.props.onClose()
      } else {
        this.setState({
          error: "error"
        })
      }
      
      
      // let contentId = this.props.type == "timeline" ? res.contentId : res
      // let id = this.props.user.urlname;
      // let profile = this.props.models[id].profile        
      // switch (type) {
      //   case "image":
      //     profile.photo.push(contentId)
      //     this.props.modelLoaded(profile,this.props.userId,"profile")    
      //     break;
      //   case "video":
      //     profile.video.push(contentId)
      //     this.props.modelLoaded(profile,this.props.userId,"profile")    
      //     break;            
      // }
      // if (this.props.type == "timeline") {
      //   let timeline = this.props.models[id].timeline
      //   if (timeline) {
      //     timeline.unshift(res)
      //     this.props.modelLoaded(timeline,this.props.userId,"timeline")    
      //   }
      // }
    })     
  }

  renderStep1() {
    return (
      <div class="file-uploader">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" onClick={this.props.onClose}>×</span></button>
        <h2 class="modal-title" id="streamEventModalLabel">Create an Event</h2>
        <div class="row">
          <div class="col-sm-6">
            <div class="form-group">
              <label for="date">Select the Date</label>
              <div>
                <DatePicker
                  className="form-control datepicker"
                  selected={this.state.startDate}
                  onChange={this.handleDateChange}
                  minDate= {new Date()}
                />
              </div>
            </div>
          </div>
          <div class="col-6 col-sm-3">
            <div class="form-group">
              <label for="sTime">Start Time</label>
              <div>
                <TimePicker
                  style={{ width: 100 }}
                  showSecond={false}
                  defaultValue={this.state.startDate}
                  className=""
                  onChange={this.handleStartTimeChange}
                />                    
              </div>
            </div>
          </div>
          <div class="col-6 col-sm-3">
            <div class="form-group">
              <label for="eTime">End Time</label>
              <div>
                <TimePicker
                  style={{ width: 100 }}
                  showSecond={false}
                  defaultValue={this.state.endDate}
                  className=""
                  onChange={this.handleEndTimeChange}
                />                    
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="form-group">
              <label for="title">Title</label>
              <input id="title" type="text" class="form-control" name="title" value={this.state.tile} onChange={this.handleChange} />
            </div>
          </div>                
          <div class="col-12">
            <div class="form-group">
              <label for="desc">Description</label>
              <textarea id="desc" cols="30" rows="8" class="form-control" name="description" value={this.state.description} onChange={this.handleChange}></textarea>
            </div>
          </div>
          
          <div class="col-12 p-0">
            <div class="file-uploader">
              <h2>Upload Photos/Videos</h2>
              <Dropzone onDrop={this.onDrop} className="dropzone needsclick dz-clickable" accept="image/*, video/*">              
                <div className="preview-images-container">
                  {this.state.preview.map((img)=>
                    <div className="preview-item" onClick={e => this.preventEvent(e)}>
                      {
                        img.type == "image" ? 
                        <img src={img.id} key={img.id} class="upload-preview" />
                        :  <img src={previewVideoThumb} key={img.id} className="upload-preview" /> 
                      }
                      
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
              <Dropzone onDrop={this.onDrop} className="btn btn-primary" accept="image/*, video/*">Upload</Dropzone>
            </div>
          </div>
        </div>
        <div class="text-right">          
          <button class="btn btn-primary" onClick={this.nextStep}>Next</button>
        </div>
      </div>     
    )    
  }

  renderStep2() {
    return (
      <div class="file-uploader">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onClose}><span aria-hidden="true">×</span></button>
        <h2 class="modal-title" id="trailerModalLabel">Create a Video Trailer</h2>
        <div class="row">
          <div class="col-12 text-center">
            <button class="btn btn-danger btn-record">Record Video</button>
            <span class="or font-weight-bold">OR</span>
          </div>        
          <div class="col-12 p-0">
            <div class="file-uploader">
              <h2>Upload Video Trailer</h2>
              <Dropzone onDrop={this.onDropTrailer} className="dropzone needsclick dz-clickable" accept="video/*">              
                <div className="preview-images-container">
                  {this.state.previewTrailer.map((img)=>
                    <div className="preview-item" onClick={e => this.preventEvent(e)}>
                      <img src={previewVideoThumb} key={img.id} className="upload-preview" />
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
                        <span className="closeIcon" onClick={e => this.removeUploadTrailer(img.contentId, e)}>
                          <img src={crossDarkGrey} width="12" alt="remove"/>
                        </span>
                        : ""
                      }
                    </div>
                  )}

                </div>
              {
                this.state.previewTrailer.length == 0 ?
                <div class="dz-message needsclick">
                  Drop files here or click to upload.
                </div>:''
              }                
              </Dropzone>
              <Dropzone onDrop={this.onDropTrailer} className="btn btn-primary" accept="video/*">Upload</Dropzone>
            </div>
          </div>
        </div>
        <div class="text-right">
          {!this.state.creating && <button class="btn mr-2" onClick={this.backStep}>Back</button>}
          <button class="btn btn-primary" onClick={this.create} >{this.state.creating ? "Creating..." : "Create"}</button>
        </div>
      </div>     
    )    
  }

  render() {
    return (
      <div>
        <div class="modal fade show d-block" id="fileUploadModal" role="dialog" aria-labelledby="fileUploadModalLabel" aria-hidden="true" onClick={this.props.onClose}>
          <div class="modal-dialog" role="document">
            <div class="modal-content upload-lightbox event" onClick={e => e.stopPropagation()}>
              {this.state.step == 1 && this.renderStep1()}
              {this.state.step == 2 && this.renderStep2()}
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show"></div>
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
    eventCreated: function(data,id){
      return {
        type: "event_created",
        id: id,
        data: data
      }
    }
})(Component)