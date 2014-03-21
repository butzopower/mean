require('../../../server.js');

beforeEach(function () {
  var mongoose = require('mongoose');

  global._ = require('lodash');

  // Potential for test pollution
  global.Article = mongoose.model('Article');
  global.User = mongoose.model('User');
  global.Tag = mongoose.model('Tag');
});

afterEach(function (done) {
  Article.remove(function () {
    User.remove(function () {
      Tag.remove(done)
    });
  });
});
