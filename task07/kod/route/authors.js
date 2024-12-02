const Router = require("@koa/router");
const Joi = require("joi");
const authorsRepo = require("../repo/authors");
const validationMiddleware = require("../middleware/validate");

const router = new Router();

router.post(
  "/authors",
  validationMiddleware.body({
    name: Joi.string().trim().required(),
  }),
  async (ctx) => {
    const author = await authorsRepo.create(ctx.request.body);
    ctx.body = author;
  }
);

router.get("/authors", async (ctx) => {
  const authors = await authorsRepo.getAll();
  ctx.body = authors;
});

router.get(
  "/authors/:authorId",
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const author = await authorsRepo.getById(ctx.params.authorId);
    if (author) {
      ctx.body = author;
    } else {
      ctx.status = 404;
      ctx.body = { error: "Author not found" };
    }
  }
);

router.delete(
  "/authors/:authorId",
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const result = await authorsRepo.remove(ctx.params.authorId);
    if (result) {
      ctx.status = 204;
    } else {
      ctx.status = 404;
      ctx.body = { error: "Author not found" };
    }
  }
);

router.put(
  "/authors/:authorId",
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
      ctx.status = 404;
      ctx.body = { error: "Author not found" };
    }
  }
);

module.exports = router;
