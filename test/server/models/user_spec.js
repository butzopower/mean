'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');

//Globals
var user, user2;

//The tests
describe('<Unit Test>', function() {
    describe('Model User:', function() {
        beforeEach(function(done) {
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password',
                provider: 'local'
            });
            user2 = new User(user);

            done();
        });

        describe('Method Save', function() {
            it('should begin without the test user', function(done) {
                User.find({ email: 'test@test.com' }, function(err, users) {
                    expect(users.length).toBe(0);
                    done();
                });
            });

            it('should be able to save without problems', function(done) {
                user.save(done);
            });

            it('should fail to save an existing user again', function(done) {
                user.save();
                return user2.save(function(err) {
                    expect(err).toBe();
                    done();
                });
            });

            it('should show an error when try to save without name', function(done) {
                user.name = '';
                return user.save(function(err) {
                    expect(err).toBe();
                    done();
                });
            });
        });

        afterEach(function(done) {
            user.remove();
            done();
        });
    });
});
