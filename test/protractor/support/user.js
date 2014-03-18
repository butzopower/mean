var page = require("./page.js").page;

exports.user = {
  signup: function (user) {
    user = user || {};
    page.get("/");
    page.clickOn("Signup");
    page.fillIn("Full Name", user.name || "Mike Dylan");
    page.fillIn("Email", user.email || "bob.dylan@example.com");
    page.fillIn("Username", user.username || "Bob.Dylan");
    page.fillIn("Password", user.password || "password");
    page.clickOn("Sign up");
  }
}
