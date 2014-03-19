var fs = require('fs');

exports.page = {
  get: function (url) {
    browser.get(url);
  },

  clickOn: function (text) {
    element(by.xpath("(//a | //button)[text()[contains(.,'" + text + "')]]")).click();
  },

  text: function (selector) {
    selector = selector || "body";
    return element(by.css(selector)).getText();
  },

  input: function(placeholder) {
    return element(by.css("[placeholder='" + placeholder  + "']"));
  },

  inputValue: function(placeholder) {
    return this.input(placeholder).getAttribute('value');
  },

  fillIn: function (placeholder, text) {
    this.input(placeholder).sendKeys(text);
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
