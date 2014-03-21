'use strict';

describe('Article', function () {
  var User, Article, Tag, user, article, _;

  beforeEach(function (done) {
    _ = require('lodash');
    User = this.requireModel('user');
    Article = this.requireModel('article');
    Tag = this.requireModel('tag');

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
        tags: ['some', 'set', 'of', 'tags'],
        user: user
      });

      done();
    });
  });

  describe('#save', function () {
    it('should be able to save without problems', function (done) {
      article.save(function (err) {
        expect(err).toBeNull();

        Article.find({ 'title': 'Article Title' }, function (err, articles) {
          expect(articles[0].title).toEqual('Article Title');
          expect(articles[0].content).toEqual('Article Content');

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

  describe('#tags', function () {
    it('uxpdates the current array of tags on the article', function (done) {
      article.save(function (err) {
        expect(err).toBeNull();

        Article.find({ 'title': 'Article Title' }, function (err, articles) {
          expect(articles[0].tags).toEqual(['some', 'set', 'of', 'tags']);

          done();
        });
      });
    });

    describe('when one of the provided tags does not currently exist on the article', function () {
      describe('and it already exists in the Tag Collection', function () {
        xit('doesnt add a new tag to the tag collection', function (done) {
          Tag.create({name: 'some'}, function (err) {
            expect(err).toBeNull();

            article.save(function (err) {
              expect(err).toBeNull();

              Tag.find({}, function (err, tags) {
                expect(tags.length).toEqual(4);
                expect(_(tags).pluck('name').value()).toEqual(['some', 'set', 'of', 'tags']);

                done();
              });
            });
          });
        });
      });

      describe('and it does not already exist in the tag collection', function () {
        xit('adds the tag to the Tag collection', function (done) {
          article.save(function (err, article) {
            expect(err).toBeNull();

            Tag.find({}, function (err, tags) {
              expect(tags.length).toEqual(4);
              expect(_(tags).pluck('name').value()).toEqual(['some', 'set', 'of', 'tags']);
              expect(_(tags).pluck('articleIds').flatten().uniq().value()).toEqual([article.id]);

              done();
            });
          });
        });
      });
    });


    describe('when one of the tags that is currently on the article has been removed', function () {
      describe('and this article is the only current user of that tag', function () {
        it('removes the tag from the tag collection', function () {

        });
      });

      describe('and there is at least one other article with this tag', function () {
        it('does not remove the tag from the Tag collection', function () {

        });
      });
    });
  });
});
