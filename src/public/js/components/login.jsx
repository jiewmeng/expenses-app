import React from 'react';

export default class Login extends React.Component {
  render() {
    return (
      <div class="container-fluid">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <form>
              <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-control" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" />
              </div>
              <input type="submit" className="btn btn-primary" value="Login" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
