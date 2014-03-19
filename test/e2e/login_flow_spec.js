'use strict';

var page = require('./support/page.js').page;
var user = require('./support/user.js').user;

describe('Login flow', function () {
  describe('Sign up', function () {
    it('can signup', function () {
      user.signup();

      expect(page.text()).toContain('home view');
    });
  });
});
