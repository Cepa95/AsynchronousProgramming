const Router = require("@koa/router");
const Joi = require("joi");
const songsRepo = require("../repo/songs");
const validationMiddleware = require("../middleware/validate");

const router = new Router();

router.post(
  "/songs",
  validationMiddleware.body({
    name: Joi.string().trim().required(),
  }),
  async (ctx) => {
    const song = await songsRepo.create(ctx.request.body);
    ctx.body = song;
  }
);

router.get("/songs", async (ctx) => {
  const songs = await songsRepo.getAll();
  ctx.body = songs;
});

router.get(
  "/songs/:songId",
  validationMiddleware.params({
    songId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const song = await songsRepo.getById(ctx.params.songId);
    if (song) {
      ctx.body = song;
    } else {
      ctx.status = 404;
      ctx.body = { error: "Song not found" };
    }
  }
);

router.delete(
  "/songs/:songId",
  validationMiddleware.params({
    songId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const result = await songsRepo.remove(ctx.params.songId);
    if (result) {
      ctx.status = 204;
    } else {
      ctx.status = 404;
      ctx.body = { error: "Song not found" };
    }
  }
);

router.put(
  "/songs/:songId",
  validationMiddleware.params({
    songId: Joi.number().integer().required(),
  }),
  validationMiddleware.body({
    name: Joi.string().trim().required(),
  }),
  async (ctx) => {
    const song = await songsRepo.update(ctx.params.songId, ctx.request.body);
    if (song.length) {
      ctx.body = song[0];
    } else {
      ctx.status = 404;
      ctx.body = { error: "Song not found" };
    }
  }
);

module.exports = router;
