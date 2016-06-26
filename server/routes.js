const AUTHENTICATED = 'AuthController.authToken';

module.exports = {
  'get /': 'AppController.index',

  'post /auth/google': 'AuthController.google',

  'get /expenses': [AUTHENTICATED, 'ExpensesController.index'],
  'post /expenses': [AUTHENTICATED, 'ExpensesController.add'],
  'put /expenses/:id': [AUTHENTICATED, 'ExpensesController.edit'],
  'delete /expenses/:id': [AUTHENTICATED, 'ExpensesController.delete'],

  'get /paymentMethods': [AUTHENTICATED, 'PaymentMethodController.index'],
  'post /paymentMethods': [AUTHENTICATED, 'PaymentMethodController.add'],

  'get /categories': [AUTHENTICATED, 'CategoriesController.index'],
  'post /categories': [AUTHENTICATED, 'CategoriesController.add'],
  'put /categories/:id': [AUTHENTICATED, 'CategoriesController.edit'],
  'delete /categories/:id': [AUTHENTICATED, 'CategoriesController.delete'],
};
