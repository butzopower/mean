var fs = require('fs');
var page = {
  get: function (url) {
    browser.get(url);
  },

  clickOn: function (text) {
    // TODO: needs to be blocking! Also cleanup
    browser.findElement(by.partialLinkText(text)).then(function(element) {
      element.click();
    }, function(error) {
      element(by.xpath("//button[contains(text(),'" + text + "')]")).click();
    });
  },

  text: function (selector) {
    selector = selector || "body";
    return element(by.css(selector)).getText();
  },

  fillIn: function (placeholder, text) {
    element(by.css("input[placeholder='" + placeholder + "']")).sendKeys(text);
  },

  takeScreenShot: function (filename) {
    filename = filename || "screenshot.png";
    browser.takeScreenshot().then(function (png) {
      var stream = fs.createWriteStream(filename);
      stream.write(new Buffer(png, 'base64'));
      stream.end();
    });
  }
}

describe("Login flow", function () {
  describe("Sign up", function () {
    it("can signup", function () {
      page.get("/");
      page.clickOn("Signup");

      expect(page.text()).toContain("Full Name");

      page.fillIn("Full Name", "Mike Dylan");
      page.fillIn("Email", "bob.dylan@example.com");
      page.fillIn("Username", "Bob.Dylan");
      page.fillIn("Password", "password");
      page.clickOn("Sign up");

      expect(page.text()).toContain("home view");
    });
  });
})
