'use strict';

var page = require('./page.js').page;
var seededUsers = require('../../../db/seeds/user.json');

exports.user = {
  signup: function (user) {
    user = user || {};
    page.get('/signup');
    page.fillIn('Full Name', user.name || 'Mike Dylan');
    page.fillIn('Email', user.email || 'bob.dylan@example.com');
    page.fillIn('Username', user.username || 'Bob.Dylan');
    page.fillIn('Password', user.password || 'password');
    page.clickOn('Sign up');
  },
  
  signin: function (user) {
    user = user || {};
    page.get('/signin');
    page.fillIn('Email', user.email || seededUsers[0].email);
    page.fillIn('Password', user.password || seededUsers[0].password);
    page.clickOn('Sign in');
  }
};
