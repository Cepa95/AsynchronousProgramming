const Router = require("@koa/router");
const Joi = require("joi");
const authorsRepo = require("../repo/authors");
const validationMiddleware = require("../middleware/validate");
const { jwtCheck } = require("../middleware/auth");
const lockingMiddleware = require("../middleware/lockingMiddleware");

const router = new Router();

router.post(
  "/authors",
  jwtCheck,
  validationMiddleware.body({
    name: Joi.string().trim().required(),
  }),
  async (ctx) => {
    const author = await authorsRepo.create(ctx.request.body);
    ctx.body = author[0];
  }
);

router.get("/authors", async (ctx) => {
  const authors = await authorsRepo.getAll();
  ctx.body = authors;
});

router.get(
  "/authors/:authorId",
  jwtCheck,
  async (ctx, next) => {
    ctx.state.lockingInfo = {
      resource_type: "author",
      resource_id: ctx.params.authorId,
    };
    await next();
  },
  lockingMiddleware,
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const author = await authorsRepo.getById(ctx.params.authorId);
    if (author) {
      ctx.body = author;
    } else {
      const err = new Error("Author not found");
      err.status = 404;
      throw err;
    }
  }
);

router.delete(
  "/authors/:authorId",
  jwtCheck,
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const result = await authorsRepo.remove(ctx.params.authorId);
    if (result) {
      ctx.status = 204;
    } else {
      const err = new Error("Author not found");
      err.status = 404;
      throw err;
    }
  }
);

router.put(
  "/authors/:authorId",
  jwtCheck,
  async (ctx, next) => {
    ctx.state.lockingInfo = {
      resource_type: "author",
      resource_id: ctx.params.authorId,
    };
    await next();
  },
  lockingMiddleware,
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
  }),
  validationMiddleware.body({
    name: Joi.string().trim().required(),
  }),
  async (ctx) => {
    const author = await authorsRepo.update(
      ctx.params.authorId,
      ctx.request.body
    );
    if (author.length) {
      ctx.body = author[0];
    } else {
      const err = new Error("Author not found");
      err.status = 404;
      throw err;
    }
  }
);

module.exports = router;
