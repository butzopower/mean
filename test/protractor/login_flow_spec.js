var page = require("./support/page.js").page;

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
