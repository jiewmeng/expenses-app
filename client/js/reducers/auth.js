import {
  AUTH_GOOGLE_LOGGED_IN,
  AUTH_GOOGLE_FAILED,
  AUTH_APP_LOGGED_IN
} from '../actions'

const initialState = {
  accessToken: '',
  expiresOn: null
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_APP_LOGGED_IN:
      return {
        accessToken: action.accessToken,
        expiresOn: action.expiresOn
      }
    default:
      return state
  }
}

export default auth
