'use strict';

describe('Model User:', function () {
  var user, user2;

  beforeEach(function (done) {
    var userParams = {
      name: 'Full name',
      email: 'test@test.com',
      username: 'user',
      password: 'password',
      provider: 'local'
    };
    user = new User(userParams);
    user2 = new User(userParams);

    done();
  });

  describe('Method Save', function () {
    it('should begin without the test user', function (done) {
      User.find({ email: 'test@test.com' }, function (err, users) {
        expect(users.length).toBe(0);
        done();
      });
    });

    it('should be able to save without problems', function (done) {
      user.save(done);
    });

    it('should fail to save an existing user again', function (done) {
      user.save();
      user2.save(function (error) {
        expect(error.err).toContain('dup key');
        done();
      });
    });

    it('should show an error when try to save without name', function (done) {
      user.name = '';
      user.save(function (error) {
        expect(error.errors.name.message).toContain('is required');
        done();
      });
    });
  });
});
