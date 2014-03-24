'use strict';

var user = require('./support/user.js').user;
var page = require('./support/page.js').page;

describe('Search flow', function () {
  describe('Searching for article containing text', function () {
    beforeEach(function () {
      user.signin();

      page.get('/#!/articles');

      page.clickOn('Create One');

      page.fillIn('Title', 'My first article');
      page.fillIn('Content', 'Some content');
      page.fillIn('Tags', 'intro, hello, first');
      page.clickOn('Submit');

      page.clickOn('Add');
      page.fillIn('Title', 'My second article');
      page.fillIn('Content', 'Some other content');
      page.fillIn('Tags', 'hello');
      page.clickOn('Submit');
    });

    it('should only show', function () {
      page.fillIn('Search', 'first');

      expect(page.text()).toContain('My first article');
      expect(page.text()).not.toContain('My second article');

      page.fillIn('Search', 'other');

      expect(page.text()).not.toContain('My first article');
      expect(page.text()).toContain('My second article');

      page.fillIn('Search', 'hello');

      expect(page.text()).toContain('My first article');
      expect(page.text()).toContain('My second article');

    //   page.clickOn('Title');
    //   page.clickOn('Title V');
    //
    //   expect(
    //     page.text().indexOf('My second article')
    //   ).toLessThan(
    //     page.text().indexOf('My first article')
    //   );
    //
    //   expect(page.text()).toContain('Title ^');
    });
  });
});
