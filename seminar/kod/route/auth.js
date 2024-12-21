const Router = require("@koa/router");
const Joi = require("joi");
const authRepo = require("../repo/auth");
const validationMiddleware = require("../middleware/validate");

const router = new Router();

router.post(
  "/register",
  validationMiddleware.body({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
  }),
  async (ctx) => {
    try {
      const user = await authRepo.registerUser(ctx.request.body);
      ctx.body = user;
    } catch (err) {
      ctx.status = 400;
      ctx.body = { error: err.message };
    }
  }
);

//dobra praksa za error da ne odajemo bas koji je tocan error
//krajnjen korisniku, kod osjetljivih stvari
router.post(
  "/login",
  validationMiddleware.body({
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
  }),
  async (ctx) => {
    try {
      const { email, password } = ctx.request.body;
      const { user, token } = await authRepo.loginUser(email, password);
      ctx.body = { user, token };
    } catch (err) {
      ctx.status = 401;
      //   ctx.body = { error: err.message || "Invalid email or password" };
      ctx.body = { error: "Invalid email or password" };
    }
  }
);

module.exports = router;
