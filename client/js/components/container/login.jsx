import { connect } from 'react-redux'
import { doGoogleLogin, loggedInWithGoogle, failedLoginWithGoogle } from '../../actions'
import Login from '../presentation/login.jsx'

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (result) => dispatch(loggedInWithGoogle(result)),
    onFailure: (err) => dispatch(failedLoginWithGoogle(err)),
  }
}

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login)

export default LoginContainer
