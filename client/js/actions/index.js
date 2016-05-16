export const AUTH_GOOGLE_LOGIN = Symbol('AUTH_GOOGLE_LOGIN')
export const AUTH_GOOGLE_LOGGED_IN = Symbol('AUTH_GOOGLE_LOGGED_IN')
export const AUTH_GOOGLE_FAILED = Symbol('AUTH_GOOGLE_FAILED')
export const AUTH_APP_LOGIN_GOOGLE_USER = Symbol('AUTH_APP_LOGIN_GOOGLE_USER')
export const AUTH_APP_LOGGED_IN = Symbol('AUTH_APP_LOGGED_IN')

export const appLoginGoogleUser = (idToken) => {
  return (dispatch) => {
    return fetch(`http://localhost:8000/auth/google`, {
      method: 'post',
      body: JSON.stringify({
        id_token: idToken
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json()
        } else {
          console.log(`ERROR: ${resp.status}`)
          throw new Error(resp.statusText)
        }
      })
      .then((data) => {
        dispatch(appLoggedIn(data))
      })
      .catch((err) => {
        console.log('error logging into app', err);
      })
  }
}

export const doGoogleLogin = () => {
  type: AUTH_GOOGLE_LOGIN
}

/**
 * When Google authenticates user passing idToken
 */
export const loggedInWithGoogle = (result) => {
  return function (dispatch) {
    const idToken = result.getAuthResponse().id_token;

    dispatch(appLoginGoogleUser(idToken))
  }
}

export const failedLoginWithGoogle = (err) => {
  return Object.assign(err, {
    type: AUTH_GOOGLE_FAILED
  })
}

export const appLoggedIn = (data) => {
  return {
    type: AUTH_APP_LOGGED_IN,
    accessToken: data.access_token,
    expiresOn: new Date(data.expires_on)
  }
}
