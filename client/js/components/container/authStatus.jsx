import { connect } from 'react-redux'
import AuthStatus from '../presentation/authStatus.jsx'

const mapStateToProps = (state) => {
  return state.auth
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

const AuthStatusContainer = connect(mapStateToProps, mapDispatchToProps)(AuthStatus)

export default AuthStatusContainer
