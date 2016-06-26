import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import auth from './reducers/auth'
import Login from './components/container/login.jsx'
import AuthStatus from './components/container/authStatus.jsx'
import Nav from './components/container/nav.jsx'

const Index = React.createClass({
  render() {
    return (
      <div>
        <Nav></Nav>
        {this.props.children}
      </div>
    )
  }
})

const NotFound = React.createClass({
  render() {
    return <div>404 Not Found</div>;
  }
})

let store = createStore(combineReducers({
  auth,
  routing: routerReducer
}), applyMiddleware(thunk));

const history = syncHistoryWithStore(hashHistory, store);

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Route path="/" component={Index}>
          <IndexRoute component={Login} />
          <Route path="login" component={Login} />
        </Route>
        <Route path="*" component={NotFound} />
      </Router>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
