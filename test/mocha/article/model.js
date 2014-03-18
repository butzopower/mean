'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Article = mongoose.model('Article');

//Globals
var user;
var article;

//The tests
describe('<Unit Test>', function() {
    describe('Model Article:', function() {
        beforeEach(function(done) {
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });

            user.save(function() {
                article = new Article({
                    title: 'Article Title',
                    content: 'Article Content',
                    tags: 'some, set, of, tags',
                    user: user
                });

                done();
            });
        });

        describe('Method Save', function() {
            it('should be able to save without problems', function(done) {
                article.save(function(err) {
                    should.not.exist(err);

                    Article.find({ 'title': 'Article Title' }, function (err, articles) {
                      articles[0].title.should.equal('Article Title');
                      articles[0].content.should.equal('Article Content');
                      articles[0].tags.should.equal('some, set, of, tags');
                      done();
                    });
                });
            });

            it('should be able to show an error when try to save without title', function(done) {
                article.title = '';

                return article.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        afterEach(function(done) {
            article.remove();
            user.remove();
            done();
        });
    });
});
