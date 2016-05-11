import React from 'react'

export default class AuthStatus extends React.Component {
  render() {
    if (this.props.expiresOn && this.props.expiresOn.getTime() > Date.now()) {
      return <div>Logged in with token {this.props.accessToken}</div>
    } else {
      return <div>Not logged in</div>
    }
  }
}
