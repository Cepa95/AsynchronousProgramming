const Router = require("@koa/router");
const Joi = require("joi");
const commentRepo = require("../repo/comment");
const validationMiddleware = require("../middleware/validate");
const { jwtCheck } = require("../middleware/auth");
const router = new Router();

router.post(
  "/comments",
  validationMiddleware.body({
    message: Joi.string().trim().required(),
    sender_id: Joi.number().integer().required(),
    receiver_id: Joi.number().integer(),
    group_id: Joi.number().integer(),
  }),

  async (ctx) => {
    const { message, sender_id, receiver_id, group_id } = ctx.request.body;

    if (
      (receiver_id == null && group_id) ||
      (group_id == null && receiver_id)
    ) {
      const comment = await commentRepo.create(ctx.request.body);
      ctx.body = comment[0];
    }
  }
);

router.get(
  "/comments/:group_id",
  validationMiddleware.params({
    group_id: Joi.number().integer().required(),
  }),
  validationMiddleware.query({
    sort_date: Joi.string().valid("ASC", "DESC").default("ASC"),
  }),
  async (ctx) => {
    const { group_id } = ctx.params;
    const { sort_date } = ctx.query;
    const comments = await commentRepo.findByGroupId(group_id, sort_date);
    ctx.body = comments;
  }
);

router.get("/user-comments", jwtCheck, async (ctx) => {
  const user_id = ctx.state.user.id;
  const comments = await commentRepo.findByUserId(user_id);
  ctx.body = comments;
});

module.exports = router;


