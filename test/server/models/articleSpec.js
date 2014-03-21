'use strict';

describe('Model Article:', function () {
  var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Article = mongoose.model('Article');

  var user;
  var article;

  beforeEach(function (done) {
    user = new User({
      name: 'Full name',
      email: 'test@test.com',
      username: 'user',
      password: 'password'
    });

    user.save(function () {
      article = new Article({
        title: 'Article Title',
        content: 'Article Content',
        tags: 'some, set, of, tags',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      article.save(function (err) {
        expect(err).toBeNull();

        Article.find({ 'title': 'Article Title' }, function (err, articles) {
          expect(articles[0].title).toEqual('Article Title');
          expect(articles[0].content).toEqual('Article Content');
          expect(articles[0].tags).toEqual('some, set, of, tags');

          done();
        });
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      article.title = '';

      article.save(function (err) {
        expect(err.errors.title).not.toBeNull();

        done();
      });
    });
  });

  afterEach(function (done) {
    article.remove();
    user.remove();
    done();
  });
});
