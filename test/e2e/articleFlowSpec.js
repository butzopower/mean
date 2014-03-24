'use strict';

var user = require('./support/user.js').user;
var page = require('./support/page.js').page;

describe('Article flow', function () {
  describe('Adding an article', function () {
    beforeEach(function () {
      user.signin();
    });

    it('should be able to add a complete article', function () {
      page.get('/#!/articles');

      page.clickOn('Create One');

      expect(page.text()).toContain('Tags');

      page.fillIn('Title', 'My first article');
      page.fillIn('Content', 'Some content');
      page.fillIn('Tags', 'intro, hello, first');
      page.clickOn('Submit');

      // Index Page
      expect(page.text()).not.toContain('Tags');

      expect(page.text()).toContain('My first article');
      expect(page.text()).toContain('Some content');
      expect(page.text()).toContain('intro');
      expect(page.text()).toContain('hello');
      expect(page.text()).toContain('first');

      // Edit Page
      $('li.my-first-article a.edit').click();

      page.fillIn('Content', 'My updated content');
      page.clickOn('Submit');
      expect(page.text()).not.toContain('Tags');
      expect(page.text()).toContain('My updated content');

      // Delete
      $('li.my-first-article a.delete').click();
      expect(page.text()).not.toContain('My first article');
    });
  });
});
