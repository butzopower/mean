var user = require('./support/user.js').user;
var page = require('./support/page.js').page;

describe("Article flow", function () {
  describe("Adding an article", function () {
    beforeEach(function () {
      user.signup();
    });

    it("should be able to add a complete article", function () {
      page.get('/#!/articles/create');

      expect(page.text()).toContain("Title");

      page.fillIn('Title', "My first article");
      page.fillIn('Content', "Some content");
      page.fillIn('Tags', "intro, hello, first");
      page.clickOn('Submit');

      page.get('/#!/articles');

      expect(page.text()).toContain("My first article");
      expect(page.text()).toContain("Some Content");
      expect(page.text()).toContain("intro");
      expect(page.text()).toContain("hello");
      expect(page.text()).toContain("first");
    });
  });
});
