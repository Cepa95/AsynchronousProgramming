const Router = require("@koa/router");
const Joi = require("joi");
const authorSongsRepo = require("../repo/author_songs");
const validationMiddleware = require("../middleware/validate");
const { jwtCheck } = require("../middleware/auth");

const router = new Router();

router.post(
  "/authors/:authorId/songs/:songId",
  jwtCheck,
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
    songId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const { authorId, songId } = ctx.params;
    const relation = await authorSongsRepo.create(authorId, songId);
    ctx.body = relation[0];
  }
);

router.delete(
  "/authors/:authorId/songs/:songId",
  jwtCheck,
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
    songId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const { authorId, songId } = ctx.params;
    const result = await authorSongsRepo.remove(authorId, songId);
    if (result) {
      ctx.status = 204;
    } else {
      const err = new Error("Relationship not found");
      err.status = 404;
      throw err;
    }
  }
);

router.get(
  "/authors/:authorId/songs",
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const songs = await authorSongsRepo.getSongsByAuthor(ctx.params.authorId);
    ctx.body = songs;
  }
);

module.exports = router;
