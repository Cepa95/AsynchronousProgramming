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
      const error = new Error(err.message);
      error.status = 400;
      throw error;
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
      const error = new Error(err.message || "Invalid email or password");
      error.status = 401;
      throw error;
    }
  }
);

module.exports = router;
