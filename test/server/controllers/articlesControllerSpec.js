'use strict';

describe('the articles controller', function () {
  var req = {body: {}, user: {}},
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Article = mongoose.model('Article'),
    articlesController = require('../../../app/controllers/articles'),
    returnPath,
    returnValue,
    subject = function (req, done) {
      User.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        username: 'jdoe',
        password: 'password'
      }, function (err, user) {
        req.user = user;

        articlesController.create(req, {
          send: function (path, json) {
            returnPath = path;
            returnValue = json;
            done();
          },
          jsonp: function (json) {
            returnValue = json;
            done();
          }
        });
      });
    };

  describe('#create', function () {
    beforeEach(function () {
      req.body = {
        title: 'New Article',
        tags: 'cool new',
        content: 'blah blah'
      };
    });

    afterEach(function (done) {
      Article.remove({}, function () {
        User.remove({}, done);
      });
    });

    it('should create a new article', function (done) {
      subject(req, function () {
        Article.findOne({title: 'New Article'}, function (err, article) {
          expect(err).toBeNull();
          expect(article.content).toEqual('blah blah');
          expect(article.tags).toEqual('cool new');
          expect(article.user.id).toEqual(req.user._id.id);

          done();
        });
      });
    });


    it('should return a hash of article attributes with the user data', function (done) {
      subject(req, function () {
        expect(returnValue.title).toEqual('New Article');
        expect(returnValue.tags).toEqual('cool new');
        expect(returnValue.content).toEqual('blah blah');
        expect(returnValue.user).toEqual({name: 'John Fail!!!', username: 'jdoe', _id: req.user.id});

        done();
      });
    });

    describe('when the article is not valid', function () {
      it('return an error', function (done) {
        req.body = {};
        subject(req, function () {
          expect(returnValue.errors.title.message).toContain('cannot be blank');
          expect(returnPath).toEqual('users/signup');

          done();
        });
      });
    });
  });
});
