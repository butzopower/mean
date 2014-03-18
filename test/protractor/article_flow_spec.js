var user = require('./support/user.js').user;
var page = require('./support/page.js').page;

describe("Article flow", function () {
  describe("Adding an article", function () {
    beforeEach(function () {
      user.signin();
    });

    it("should be able to add a complete article", function () {
      page.get('/#!/articles/create');

      expect(page.text()).toContain("Title");

      page.fillIn('Title', "My first article");
      page.fillIn('Content', "Some content");
      page.fillIn('Tags', "intro, hello, first");
      page.clickOn('Submit');

      // Show Page
      expect(page.text()).toContain("My first article");
      expect(page.text()).toContain("Some content");
      expect(page.text()).toContain("intro");
      expect(page.text()).toContain("hello");
      expect(page.text()).toContain("first");

      // Index Page
      page.get('/#!/articles');

      expect(page.text()).toContain("My first article");
      expect(page.text()).toContain("Some content");
      expect(page.text()).toContain("intro");
      expect(page.text()).toContain("hello");
      expect(page.text()).toContain("first");

      // Edit Page
      page.clickOn("My first article");
      page.clickOn("Edit");

      expect(page.inputValue("Title")).toEqual("My first article");
      expect(page.inputValue("Tags")).toEqual("intro, hello, first");
      expect(page.inputValue("Content")).toEqual("Some content");
    });
  });
});
