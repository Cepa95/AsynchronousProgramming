const { expect } = require("chai");
const authorRepo = require("../repo/authors");
const usersRepo = require("../repo/users");

let token;

before(async function () {
  await usersRepo.deleteByEmail("testuser@gmail.com");

  const testUser = await usersRepo.create({
    email: "testuser@gmail.com",
    password: "password",
  });
  token = usersRepo.jwtUserId(testUser.id);
});

describe("Author routes", function () {
  describe("GET /authors", function () {
    it("should fetch authors", async function () {
      const resp = await global.api
        .get("/authors")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(resp.body.length > 0).to.be.true;
      expect(Object.keys(resp.body[0])).to.deep.equal([
        "id",
        "name",
        "created_at",
      ]);
    });
  });

  describe("GET /authors/:authorId", function () {
    let createdAuthor;
    const authorName = "author";

    before(async function () {
      const result = await authorRepo.create({
        name: authorName,
      });
      createdAuthor = result[0];
    });

    it("should fetch author by id", async function () {
      const resp = await global.api
        .get(`/authors/${createdAuthor.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(resp.body.name).to.be.equal(authorName);
    });
  });

  describe("POST /authors", async function () {
    it("should create a new author", async function () {
      const newName = "newAuthor";
      const resp = await global.api
        .post("/authors")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: newName,
        })
        .expect(200);

      expect(resp.body.name).to.be.equal(newName);
    });
  });

  describe("DELETE /authors/:authorId", function () {
    let createdAuthor;
    const authorName = "authorToDelete";

    before(async function () {
      const result = await authorRepo.create({
        name: authorName,
      });
      createdAuthor = result[0];
    });

    it("should delete an author by id", async function () {
      await global.api
        .delete(`/authors/${createdAuthor.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const resp = await global.api
        .get(`/authors/${createdAuthor.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(resp.body.error).to.be.equal("Author not found");
    });
  });

  describe("PUT /authors/:authorId", function () {
    let createdAuthor;
    const authorName = "authorToUpdate";
    const updatedName = "updatedAuthor";

    before(async function () {
      const result = await authorRepo.create({
        name: authorName,
      });
      createdAuthor = result[0];
    });

    it("should update an author by id", async function () {
      const resp = await global.api
        .put(`/authors/${createdAuthor.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: updatedName,
        })
        .expect(200);

      expect(resp.body.name).to.be.equal(updatedName);

      const getResp = await global.api
        .get(`/authors/${createdAuthor.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(getResp.body.name).to.be.equal(updatedName);
    });
  });
});
