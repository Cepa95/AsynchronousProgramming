const Router = require("@koa/router");
const Joi = require("joi");
const authorSongsRepo = require("../repo/author_songs");
const validationMiddleware = require("../middleware/validate");

const router = new Router();

router.post(
  "/authors/:authorId/songs/:songId",
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
    songId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const { authorId, songId } = ctx.params;
    const relation = await authorSongsRepo.create(authorId, songId);
    ctx.body = relation;
  }
);

router.delete(
  "/authors/:authorId/songs/:songId",
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
      ctx.status = 404;
      ctx.body = { error: "Relationship not found" };
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
