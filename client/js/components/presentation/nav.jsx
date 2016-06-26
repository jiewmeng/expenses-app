const React = require('react')

export default class Nav extends React.Component {
  render() {
    let navLinks;

    if (this.props.isLoggedIn) {
      navLinks = (
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <a className="nav-link" href="#">Expenses</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Settings</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Logout</a>
          </li>
        </ul>
      )
    } else {
      navLinks = (
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <a className="nav-link" href="#">Login/Signup</a>
          </li>
        </ul>
      )
    }

    return (
      <nav className="navbar navbar-dark bg-inverse">
        <a className="navbar-brand" href="#">Expenses</a>
        {navLinks}
      </nav>
    )
  }
}
