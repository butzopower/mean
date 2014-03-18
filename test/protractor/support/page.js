var fs = require('fs');

exports.page = {
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
};
