'use strict';

var user = require('./support/user.js').user;
var page = require('./support/page.js').page;

describe('Search flow', function () {
  describe('Searching for article containing text', function () {
    var addArticle = function (params) {
      page.clickOn('Add');

      page.fillIn('Title', params.title);
      page.fillIn('Content', params.content);
      page.fillIn('Tags', params.tags);
      page.clickOn('Submit');
    };

    beforeEach(function () {
      user.signin();

      page.get('/#!/articles');

      addArticle({title: 'My first article', content: 'Some content', tags: 'intro, hello, first'});
      addArticle({title: 'My second article', content: 'Some other content', tags: 'hello'});
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
    });
  });
});
