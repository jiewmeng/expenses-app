'use strict';

module.exports = {
  'get /': function*(next) {
    yield this.render('index');
    yield next;
  }
};
