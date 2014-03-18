var fs = require('fs');

exports.page = {
  get: function (url) {
    browser.get(url);
  },

  clickOn: function (text) {
    element(by.xpath("(//a | //button)[contains(text(),'" + text + "')]")).click();
  },

  text: function (selector) {
    selector = selector || "body";
    return element(by.css(selector)).getText();
  },

  fillIn: function (placeholder, text) {
    element(by.css("[placeholder='" + placeholder + "']")).sendKeys(text);
  },

  takeScreenshot: function (filename) {
    filename = filename || "screenshot.png";
    browser.takeScreenshot().then(function (png) {
      var stream = fs.createWriteStream(filename);
      stream.write(new Buffer(png, 'base64'));
      stream.end();
    });
  }
};
