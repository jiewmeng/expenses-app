const React = require('react')

export default class Login extends React.Component {
  componentDidMount() {
    gapi.signin2.render(this.refs.btnLogin, {
      'scope': 'profile email',
      'theme': 'dark',
      'onsuccess': this.props.onLogin,
      'onfailure': this.props.onFailure
    })
  }

  render() {
    return (
      <div ref="btnLogin">Login</div>
    )
  }
}
