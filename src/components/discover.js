import React from 'react';
import PropTypes from 'prop-types'
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux'

import config from 'src/config'
import api from 'src/helpers/api'

import { LoadingBlock } from './common/LoadingBlock'
import Header from './header'
import { UserListItem } from './discover/userListItem'
import { Search } from './search'

import { 
  getSearchedUsers,
  getSearchedCount } from 'store/selectors/search'

class Component extends React.Component {
  
  state = {
    tab: "recent"
  }

  componentWillMount() {
    this.loadTab(this.state.tab)
  }

  loadTab = (tab) => {
    let key = tab+"_loading";
    this.setState({[key]: true})
    api("/model/"+tab,{
      skip: 0, 
      limit: 20
    }).then((res) => {    
      if (res && res.items && this.state[key]) {
        // this.setState({[tab]: res.items})
        this.props.discoverLoaded(tab,res.items,res.total)
      }
      this.setState({[key]: false})
    })    
  }

  changeTab = (e,tab) => {
    e && e.preventDefault();
    if (this.state.tab == tab) return;
    this.setState({tab})
    if (!this.state[tab]) this.loadTab(tab);
  }

  openPage = (e,page) => {
    e.preventDefault()
    this.props.history.push(page)
  }

  getUserList = columns => {
    const { tab } = this.state

    return (
      <div>
        <div class="button-list">
          <a href="#" class={"btn btn-primary "+(tab == "recent" ? "active" : "")} onClick={e => this.changeTab(e,"recent")}>Recent</a>
          <a href="#" class={"btn btn-primary "+(tab == "online" ? "active" : "")} onClick={e => this.changeTab(e,"online")}>Online</a>
        </div>
        <div class="row">
          {columns.map((item,key) =>
            <UserListItem
              column={item}
              c={key}
              key={key}
              openPage={this.openPage}
            />
          )}
        </div>
      </div>
    )
  }

  render() {

    const { searchKey, searchFetching, searchedModels } = this.props

    let columns = this.state.tab == "recent" ?   this.props.recentColumns : this.props.onlineColumns
    return (
      <div>
        <Header page='discover' />
        <main id="main">
          <div class="content-block explore v2 v3 v5 v6 v7">
            <div class="container-fluid">
            {searchKey == "" ?
              this.getUserList(columns)
              :
              <Search>
                <LoadingBlock active={searchFetching} />
                <Search.List>
                  {Object.values(searchedModels).map(({_id: id, name, description, urlname, avatar, photo}) => (
                    <Search.Row
                      key={id}
                      name={name}
                      image={avatar}
                      description={description}
                      photos={photo}
                      url={urlname}
                    />
                  ))}
                </Search.List>
              </Search>
            }
            </div>
          </div>
        </main>
      </div>
    )
  }
}

const mapStateToProps = ({ session, discover, search }) => ({
  logged: !!session.user,
  user: session.user,
  recentItems: discover.recent.items,
  recentColumns: discover.recent.itemColumns,
  onlineItems: discover.online.items,
  onlineColumns: discover.online.itemColumns,
  discover: discover,
  searchKey: search.searchKey,
  searchedModels: getSearchedUsers(search),
  searchedModelCount: getSearchedCount(search),
  searchFetching: search.searchFetching,
  searchDidFetch: search.searchDidFetch,
})

const mapDispatchToProps = ({
  discoverLoaded: (type, items, total) => ({
    type : "discover_loaded",
    data: {
      type: type,
      items: items,
      total: total
    }
  }),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component)