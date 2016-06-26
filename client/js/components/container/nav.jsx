import { connect } from 'react-redux'
import Nav from '../presentation/nav.jsx'

const mapStateToProps = (state) => {
  let isLoggedIn = false;

  if (typeof state.auth === 'object'
    && state.auth.hasOwnProperty('expiresOn')
    && state.auth.expiresOn > Date.now()) {
      isLoggedIn = true;
    }

  return {isLoggedIn}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

const NavContainer = connect(mapStateToProps, mapDispatchToProps)(Nav)

export default NavContainer
