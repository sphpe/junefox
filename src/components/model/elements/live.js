import React from 'react';
import { connect } from 'react-redux';
import { Player } from 'video-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { loadChatAction } from 'store/action-creators/model'

class Live extends React.Component {
  
  componentWillMount() {
    this.load()
  }

  load = () => {
    if (this.props.loading || !this.props.hasMore) return;
    this.props.load(this.props.urlname,this.props.skip,this.props.limit)
  }

  render() {  
    return (
      <div>
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
            {this.props.items.map(item =>
              <div key={item._id}>{item.text}</div>
            )}
          </ul>
        </InfiniteScroll>
      </div>
    )
  }
}

export default connect(
  ({ currentModel }) => ({...currentModel.chat, urlname: currentModel.profile.urlname}),
  {load: loadChatAction}
)(Live);
