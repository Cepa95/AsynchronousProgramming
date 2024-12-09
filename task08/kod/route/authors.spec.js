const { expect } = require("chai");
const authorRepo = require("../repo/authors");

describe("Author routes", function () {
  describe("GET /authors", function () {
    it("should fetch authors", async function () {
      const resp = await global.api.get("/authors").expect(200);

      //console.log("Response Body:", resp.body);

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
      //   console.log("aaaaaaaaaaaa");
      //   console.log(result);
      //   console.log("bbbbbbbbbbbbbbbbbbbb");
      //    console.log(result[0]);
      createdAuthor = result[0];
      //console.log("Created Author:", createdAuthor);
    });

    it("should fetch author by id", async function () {
      const resp = await global.api
        .get(`/authors/${createdAuthor.id}`)
        .expect(200);

      //console.log("Response Body:", resp.body);
      expect(resp.body.name).to.be.equal(authorName);
    });
  });

  describe("POST /authors", async function () {
    it("should create a new author", async function () {
      const newName = "newAuthor";
      const resp = await global.api
        .post("/authors")
        .send({
          name: newName,
        })
        .expect(200);
      // console.log("Response Body:", resp.body);
      // console.log("Response Body:", resp.body[0].name);

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
      await global.api.delete(`/authors/${createdAuthor.id}`).expect(204);

      const resp = await global.api
        .get(`/authors/${createdAuthor.id}`)
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
        .send({
          name: updatedName,
        })
        .expect(200);
      //   console.log("RESPONSE BODY");
      //   console.log(resp.body);

      expect(resp.body.name).to.be.equal(updatedName);

      const getResp = await global.api
        .get(`/authors/${createdAuthor.id}`)
        .expect(200);

      expect(getResp.body.name).to.be.equal(updatedName);
    });
  });
});
