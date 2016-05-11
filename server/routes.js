const AUTHENTICATED = 'AuthController.authToken';

module.exports = {
  'get /': 'AppController.index',

  'post /auth/google': 'AuthController.google',

  'get /expenses': [AUTHENTICATED, 'ExpensesController.index'],
  'post /expenses': [AUTHENTICATED, 'ExpensesController.add'],
};
