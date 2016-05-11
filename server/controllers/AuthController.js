'use strict';

const Auth = require('../services/Auth');
const AppError = require('../classes/AppError');
const jwt = require('jsonwebtoken');

module.exports = {
  /**
   * `POST /auth/google`
   *
   * Logs in a google user. Pass in a Google ID token. Returns an app access token.
   * If a user with associated Google ID does not exists, one is created.
   */
  google: function*(next) {
    let idToken = JSON.parse(this.request.body).id_token;

    if (!idToken) return this.throw('Missing ID token', 400);
    let id = yield Auth.verifyGoogleIdToken(idToken);

    if (id.aud !== this.config.auth.google.clientId) return this.throw('Invalid ID token (not for this app)', 400);

    let token = yield Auth.loginOrSignupGoogleUser(id, this.config.key);
    this.body = token;
  },

  authToken: function*(next) {
    const regexAuthHeader = /^Bearer (.+)$/;
    const authHeader = this.request.get('authorization');

    if (!authHeader) throw new AppError('Missing authorization header', 403);

    const headerMatch = regexAuthHeader.exec(authHeader);
    if (!headerMatch) throw new AppError('Invalid authorization header', 403);

    const token = headerMatch[1];

    const user = yield Auth.authenticateToken(token, this.config.key);
    this.state.user = user;

    yield next;
  }
}
