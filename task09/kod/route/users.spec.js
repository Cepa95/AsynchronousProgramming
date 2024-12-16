const { expect } = require("chai");
const bcrypt = require("bcrypt");
const songsRepo = require("../repo/users");


const usersRepo = require("../repo/users");

before(async function () {
  await usersRepo.deleteByEmail("testuser@gmail.com");

  const testUser = await usersRepo.create({
    email: "testuser@gmail.com",
    password: "password",
  });
  token = usersRepo.jwtUserId(testUser.id);
});

describe("User routes", function () {
  describe("POST /login", function () {
    it("should log in the user", async function () {
      const resp = await global.api.post("/login").send({
        email: "testuser@gmail.com",
        password: "password",
      });

      expect(!!resp.body.token).to.be.true;
    });
  });

  describe("POST /signup", function () {
    it("should register user", async function () {
      const email = "email123@gmail.com";
      const password = "password";
      const resp = await global.api
        .post("/signup")
        .send({
          email,
          password,
        })
        .expect(200);
      expect(resp.body.email).to.be.equal(email);
      const createdUser = await usersRepo.getByEmail(email);
      expect(createdUser).to.not.be.null;

      const isPasswordHashed = await bcrypt.compare(
        password,
        createdUser.password
      );
      expect(isPasswordHashed).to.be.true;
    });
  });
});
