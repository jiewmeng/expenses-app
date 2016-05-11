'use strict';

const google = require('googleapis');
const GoogleOAuth2 = google.auth.OAuth2;
const Promise = require('bluebird');
const AppError = require('../classes/AppError');
const superagent = require('superagent');
const User = require('../models/User');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const jwtVerify = Promise.promisify(jwt.verify, { context: jwt });

module.exports = {
  /**
   * Returns a Google OAuth2 client
   *
   * @param  {object} appConfig the app config object
   * @param  {string} siteUrl the site URL
   * @return {object} google oauth2 object
   */
  getGoogleOAuthClient(appConfig, siteUrl) {
    let googleConfig = appConfig.auth.google;

    console.log('siteUrl', siteUrl)
    let oauthClient = new GoogleOAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      `${siteUrl}/auth/google-callback`);

    return oauthClient;
  },

  /**
   * Gets Google OAuth2 authentication URL
   *
   * @param  {object} appConfig the app config object
   * @param  {string} siteUrl the site URL
   * @return {string} Google OAuth2 authentication URL
   */
  getGoogleAuthUrl(appConfig, siteUrl) {
    let oauthClient = this.getGoogleOAuthClient(appConfig, siteUrl);

    return oauthClient.generateAuthUrl({
      access_type: 'online',
      scope: 'https://www.googleapis.com/auth/plus.me'
    });
  },

  /**
   * Gets Google OAuth2 access token
   * @param  {object} appConfig the app config object
   * @param  {string} siteUrl the site URL
   * @param  {string} code google authorization code
   * @return {Promise} resolved with token object
   */
  getGoogleAccessToken(appConfig, siteUrl, code) {
    let oauthClient = this.getGoogleOAuthClient(appConfig, siteUrl);
    let getToken = Promise.promisify(oauthClient.getToken, {context: oauthClient});

    return new Promise((resolve, reject) => {
      oauthClient.getToken(code, function(err, tokens) {
        if (err) {
          if (err.message === 'invalid_grant') {
            return reject(new AppError('The Google authorization code is invalid. Please try logging in again.', 401));
          }
          return reject(err);
        }
        resolve(tokens);
      });
    });
  },

  verifyGoogleIdToken(idToken) {
    return new Promise((resolve, reject) => {
      superagent.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`)
        .end((err, resp) => {
          if (err) {
            return reject(new AppError('Google ID token appears invalid', 400, err));
          }
          resolve(resp.body);
        });
    })
  },

  /**
   * Login or signup a google user
   * @param  {object} id the decoded google id token
   * @return {Promise} resolved with an app access token
   */
  loginOrSignupGoogleUser: function*(id, appKey) {
    let user = yield User.findOneAndUpdate({
      googleId: id.sub
    }, {
      googleId: id.sub,
      displayName: id.name,
      email: id.email,
      image: id.picture
    }, {upsert: true});

    let payload = {
      sub: user._id,
      iat: Math.floor(Date.now()/1000),
      exp: moment().add(7, 'days').valueOf()
    };

    let token = jwt.sign(payload, appKey);

    return {
      access_token: token,
      expires_on: payload.exp
    };
  },

  /**
   * Authenticates an app access token. Returns the user ID
   */
  authenticateToken(token, appKey) {
    const tokenType = typeof token;
    if (tokenType !== 'string') throw new AppError('Invalid access token type', 500, `Expected string but got ${tokenType}`);

    let tokenData;
    return jwtVerify(token, appKey)
      .then((data) => {
        return data.sub;
      })
      .then((userId) => {
        return User.findOne({_id: userId});
      })
      .then((user) => {
        if (!user) throw new AppError('User not found', 403);
        return user;
      })
      .catch((err) => {
        if (err instanceof AppError) throw err;
        console.log(err)
        throw new AppError('Invalid access token', 403, err);
      });
  }
}
