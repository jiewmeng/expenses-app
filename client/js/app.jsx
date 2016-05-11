import React from 'react'
import ReactDOM from 'react-dom'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import expensesApp from './reducers'
import Login from './components/container/login.jsx'
import AuthStatus from './components/container/authStatus.jsx'

class App extends React.Component {
  render() {
    return (
      <div>
        <Login />
        <AuthStatus />
      </div>
    )
  }
}

let store = createStore(expensesApp, applyMiddleware(thunk));


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
