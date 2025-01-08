const { expect } = require("chai");
const songsRepo = require("../repo/songs");
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

describe("Song routes", function () {
  describe("GET /songs", function () {
    it("should fetch songs", async function () {
      const resp = await global.api
        .get("/songs")
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

  describe("GET /songs/:songId", function () {
    let createdSong;
    const songTitle = "song";

    before(async function () {
      const result = await songsRepo.create({
        name: songTitle,
      });
      createdSong = result[0];
    });

    it("should fetch song by id", async function () {
      const resp = await global.api
        .get(`/songs/${createdSong.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(resp.body.name).to.be.equal(songTitle);
    });
  });

  describe("POST /songs", function () {
    it("should create a new song", async function () {
      const newSong = { name: "newSong" };
      const resp = await global.api
        .post("/songs")
        .set("Authorization", `Bearer ${token}`)
        .send(newSong)
        .expect(200);

      expect(resp.body.name).to.be.equal(newSong.name);
    });
  });

  describe("DELETE /songs/:songId", function () {
    let createdSong;
    const songTitle = "songToDelete";

    before(async function () {
      const result = await songsRepo.create({
        name: songTitle,
      });
      createdSong = result[0];
    });

    it("should delete a song by id", async function () {
      await global.api
        .delete(`/songs/${createdSong.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const resp = await global.api
        .get(`/songs/${createdSong.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(resp.body.error).to.be.equal("Song not found");
    });
  });

  describe("PUT /songs/:songId", function () {
    let createdSong;
    const songTitle = "songToUpdate";
    const updatedTitle = "updatedSong";

    before(async function () {
      const result = await songsRepo.create({
        name: songTitle,
      });
      createdSong = result[0];
    });

    it("should update a song by id", async function () {
      const resp = await global.api
        .put(`/songs/${createdSong.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: updatedTitle,
        })
        .expect(200);

      expect(resp.body.name).to.be.equal(updatedTitle);

      const getResp = await global.api
        .get(`/songs/${createdSong.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(getResp.body.name).to.be.equal(updatedTitle);
    });
  });
});