import React from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { getImage, getVideo } from 'src/helpers/images';
import api from 'src/helpers/api'

import config from 'src/config.js'

import { loadPhotosAction } from 'store/action-creators/model'

class PhotoTab extends React.Component {

  state = {
    loading: false,
    isOpen: false,
    photoIndex: 0    
  }
  
  // TODO - move to redux
  removeImage = (image, e) => {
    e && e.preventDefault() && e.stopPropagation();
    if (confirm("Are you sure?")) {
      const { model: { photo } } = this.props;
      photo.splice(photo.indexOf(image), 1);
      this.props.save({ target: {
        name: "photo",
        value: photo
      }});
    }
  }

  // TODO - move to redux
  setAvatar = (image,e) => {
    e && e.preventDefault() && e.stopPropagation()
    let id = this.props.match.params.id
    api("model/update", {
      key: "avatar",
      value: image
    })
    const { model } = this.props;
    this.props.modelLoaded({ ...model, ["avatar"]: image }, id, "profile")    
    this.props.modelProfileActions({ data: { ...model, ["avatar"]: image }, type: 'model-profile-updated' })  
  }

  showLightBox = ({ image, ind }) =>
    this.setState({
      isOpen: true,
      imgLink: image,
      photoIndex: ind
    });

  closeLightbox = () =>
    this.setState({
      isOpen: false,
      imgLink: '',
      photoIndex: 0
    });

  lightBoxNavigation = ({ prev, length }) => {
    const { photoIndex } = this.state;
    const ind = prev ? (photoIndex + length - 1) % length : (photoIndex + 1) % length;
    this.setState({ photoIndex: ind });
  }  

  componentWillMount() {
    this.load()
  }

  load = () => {
    if (this.props.loading || !this.props.hasMore) return;
    this.props.load(this.props.match.params.id,this.props.skip,this.props.limit)
  }

  render() {
    const { photoIndex } = this.state;
    const { items } = this.props;
    let itemsLength = items.length
    return (
      <div>
        {this.state.isOpen && (
          <Lightbox
            mainSrc={getImage(items[photoIndex], 'orig')}
            onCloseRequest={this.closeLightbox}
            nextSrc={getImage(items[(photoIndex + 1) % itemsLength], 'orig')}
            prevSrc={getImage(items[(photoIndex + itemsLength - 1) % itemsLength], 'orig')}
            onMovePrevRequest={() => this.lightBoxNavigation({ prev: true, length: itemsLength })}
            onMoveNextRequest={() => this.lightBoxNavigation({ prev: false, length: itemsLength })}
          />
        )}      
        <InfiniteScroll
          dataLength={itemsLength}
          next={this.load}
          hasMore={this.props.hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{textAlign: 'center'}}>
              {itemsLength > 0 ? <b>Yay! You have seen it all</b> : <b>No content</b>}
            </p>
          }
          style={{ overflowX: 'hidden' }}
        >
          <ul class="gallery-list">
            {items.map((photo, ind) =>
              <li key={photo}>
                <div class="image-remove" onClick={e => this.removeImage(photo,e)}>X</div>
                <div class="image-setavatar" onClick={e => this.setAvatar(photo,e)}>V</div> 
                <a
                  onClick={e => {e.preventDefault(); this.showLightBox({ image: getImage(photo, 'orig'), ind })}}
                  href={getImage(photo,"orig")}
                  target="_blank"
                >                                                 
                    <img class="img-fluid" src={getImage(photo,"gallery")} alt="image description" />
                </a>
              </li>
            )}            
          </ul>
        </InfiniteScroll>
      </div>
    );
  }
};

export default connect(
  ({ discover, currentModel }) => ({ 
    models: discover.models, 
    model: currentModel.profile, 
    ...currentModel.photos
  }),
  {
    modelLoaded: function(data, id, field){
      return {
        type: "model_profile_loaded",
        id: id,
        field: field,
        data: data
      }
    },
    modelProfileActions: ({ data, type }) => ({ type, data }),
    load: loadPhotosAction
  }
)(PhotoTab);
