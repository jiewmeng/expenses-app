const React = require('react')

export default class Login extends React.Component {
  componentDidMount() {
    gapi.signin2.render(this.refs.btnLogin, {
      'scope': 'profile email',
      'theme': 'light',
      'width': 220,
      'height': 50,
      'longtitle': true,
      'onsuccess': this.props.onLogin,
      'onfailure': this.props.onFailure
    })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3">
            <div className="card">
              <div className="card-block">
                <h1 className="card-title header-big">Login</h1>
                <div ref="btnLogin" className="btnLogin"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
