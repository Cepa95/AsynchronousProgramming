const Router = require("@koa/router");
const Joi = require("joi");
const resourceLocks = require("../repo/resourceLocks");
const validationMiddleware = require("../middleware/validate");
const { jwtCheck } = require("../middleware/auth");

const router = new Router();

router.post(
  "/resource-locks",
  jwtCheck,
  validationMiddleware.body({
    resource_type: Joi.string().valid("author", "song").required(),
    resource_id: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const { resource_type, resource_id } = ctx.request.body;
    const user_id = ctx.state.user.id;

    try {
      await resourceLocks.lockResource(resource_type, resource_id, user_id);
      ctx.status = 201;
      ctx.body = { message: "Resource locked successfully" };
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
  }
);

router.delete(
  "/resource-locks/:resourceId",
  jwtCheck,
  validationMiddleware.body({
    resource_type: Joi.string().valid("author", "song").required(),
  }),
  validationMiddleware.params({
    resourceId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const { resourceId } = ctx.params;
    const { resource_type } = ctx.request.body;
    const user_id = ctx.state.user.id;

    try {
      await resourceLocks.unlockResource(resource_type, resourceId, user_id);
      ctx.status = 204;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
  }
);

module.exports = router;
