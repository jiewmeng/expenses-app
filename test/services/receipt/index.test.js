'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('receipt service', () => {
  it('registered the receipts service', () => {
    assert.ok(app.service('receipts'));
  });
});
