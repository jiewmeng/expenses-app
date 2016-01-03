import React from 'react';
import Topbar from './topbar.jsx';
import Login from './login.jsx';

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <Topbar />
        <Login />
      </div>
    );
  }
});
