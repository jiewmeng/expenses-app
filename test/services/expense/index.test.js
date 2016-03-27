'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('expense service', () => {
  it('registered the expenses service', () => {
    assert.ok(app.service('expenses'));
  });
});
