'use strict';

process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var config = require('../../../config/config');
mongoose.connect(config.db);

require('../../../app/models/tag');
var Tag = mongoose.model('Tag');

require('../../../app/models/article');
var Article = mongoose.model('Article');

require('../../../app/models/user');
var User = mongoose.model('User');

beforeEach(function () {
  this.requireModel = function(model) {
    require('../../../app/models/' + model);
    return mongoose.model(model.charAt(0).toUpperCase() + model.slice(1));
  };
});

afterEach(function (done) {
  Article.remove(function () {
    User.remove(function () {
      Tag.remove(done);
    });
  });
});
