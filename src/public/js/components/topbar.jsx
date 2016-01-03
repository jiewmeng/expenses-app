import React from'react';

module.exports = React.createClass({
  render: function() {
    return (
      <div id="topbar">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <nav className="navbar navbar-dark bg-inverse">
                <a href="javascript:;" className="navbar-brand">
                  Expenses
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
