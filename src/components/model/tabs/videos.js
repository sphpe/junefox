import React from 'react';
import { connect } from 'react-redux';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { loadVideosAction } from 'store/action-creators/model'

class VideosTab extends React.Component {
  
  componentWillMount() {
    this.load()
  }

  load = () => {
    if (this.props.loading || !this.props.hasMore) return;
    this.props.load(this.props.match.params.id,this.props.skip,this.props.limit)
  }

  render() {  
    return (
      <InfiniteScroll
        dataLength={this.props.items.length}
        next={this.load}
        hasMore={this.props.hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{textAlign: 'center'}}>
            {this.props.items.length > 0 ? <b>Yay! You have seen it all</b> : <b>No content</b>}
          </p>
        }
        style={{ overflowX: 'hidden' }}
      >
        <ul class="gallery-list videos">
          {this.props.items.map(video =>
            <li key={video}>
              <Player playsInline src={getVideo(video,"orig")} />
            </li>
          )}
        </ul>
      </InfiniteScroll>
    )
  }
}

export default connect(
  ({ currentModel }) => ({...currentModel.videos}),
  {load: loadVideosAction}
)(VideosTab);
