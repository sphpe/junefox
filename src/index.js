// import 'bootstrap';
import "babel-polyfill"
import "assets/css/bootstrap.min.css"
import "./scss/main.scss"

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux'

import {store, history} from './store'
import Router from './router'

class App extends React.Component {
  render() {
    return (
      <div id="wrapper" onClick={this.hidePopups}>
        <Provider store={store}>
          <ConnectedRouter history={history}>       
            <Router />                
          </ConnectedRouter>
        </Provider>
      </div>
    )    
  }
}


ReactDOM.render(<App />, document.getElementById("app-mount"));