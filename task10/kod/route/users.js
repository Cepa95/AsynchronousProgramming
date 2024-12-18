const Router = require("@koa/router");
const Joi = require("joi");
const usersRepo = require("../repo/users");
const validationMiddleware = require("../middleware/validate");

const router = new Router();

router.post(
  "/signup",
  validationMiddleware.body({
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
  }),
  async (ctx) => {
    const user = await usersRepo.create(ctx.request.body);
    ctx.body = user;
  }
);

router.post(
  "/login",
  validationMiddleware.body({
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
  }),
  async (ctx) => {
    const user = await usersRepo.getByEmail(ctx.request.body.email);

    if (!user) {
      ctx.body = {
        status: 401,
        message: "Krivo brate...",
      };
      return;
    }

    const isPassNotGood = await usersRepo.checkPassword(
      user.password,
      ctx.request.body.password
    );
    if (!isPassNotGood) {
      ctx.body = {
        status: 401,
        message: "wrong username or password",
      };
      return;
    }

    console.log("bcrypt compare ");
    console.log(user);
    ctx.body = { user, token: usersRepo.jwtUserId(user.id) };
  }
);

module.exports = router;
