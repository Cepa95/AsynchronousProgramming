const { expect } = require("chai");
const authorRepo = require("../repo/authors");
const songsRepo = require("../repo/songs");
const authorSongsRepo = require("../repo/author_songs");

describe("Author-Song routes", function () {
  let createdAuthor;
  let createdSong;

  before(async function () {
    const authorResult = await authorRepo.create({
      name: "author",
    });
    createdAuthor = authorResult[0];

    const songResult = await songsRepo.create({
      name: "song",
    });
    createdSong = songResult[0];
  });

  describe("POST /authors/:authorId/songs/:songId", function () {
    it("should create a new author-song relationship", async function () {
      const resp = await global.api
        .post(`/authors/${createdAuthor.id}/songs/${createdSong.id}`)
        .expect(200);

      //console.log("Response Body:", resp.body);

      expect(resp.body.author_id).to.be.equal(createdAuthor.id);
      expect(resp.body.song_id).to.be.equal(createdSong.id);
    });
  });

  describe("DELETE /authors/:authorId/songs/:songId", function () {
    before(async function () {
      await authorSongsRepo.remove(createdAuthor.id, createdSong.id);

      await authorSongsRepo.create(createdAuthor.id, createdSong.id);
    });

    it("should delete an author-song relationship by id", async function () {
      await global.api
        .delete(`/authors/${createdAuthor.id}/songs/${createdSong.id}`)
        .expect(204);

      const resp = await global.api
        .get(`/authors/${createdAuthor.id}/songs`)
        .expect(200);

      expect(resp.body).to.not.deep.include({ id: createdSong.id });
    });
  });

  describe("GET /authors/:authorId/songs", function () {
    before(async function () {
      await authorSongsRepo.create(createdAuthor.id, createdSong.id);
    });

    it("should fetch songs by author id", async function () {
      const resp = await global.api
        .get(`/authors/${createdAuthor.id}/songs`)
        .expect(200);

      console.log("Response Body:", resp.body);

      expect(resp.body.length > 0).to.be.true;
      expect(Object.keys(resp.body[0])).to.deep.equal([
        "id",
        "name",
        "created_at",
      ]);
    });
  });
});
