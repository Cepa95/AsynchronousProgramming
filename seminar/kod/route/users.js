const Router = require("@koa/router");
const Joi = require("joi");
const usersRepo = require("../repo/users");
const { jwtCheck, authorizeAdmin } = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validate");

const router = new Router();

router.get("/users", jwtCheck, authorizeAdmin, async (ctx) => {
  const users = await usersRepo.getUsers();
  ctx.body = users;
});

router.delete(
  "/users/:id",
  jwtCheck,
  authorizeAdmin,
  validationMiddleware.params({
    id: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const { id } = ctx.params;
    await usersRepo.deleteUser(id);
    ctx.status = 204;
  }
);

//basic provjera da user moze samo sebe updatetat
router.put(
  "/users/:id",
  jwtCheck,
  validationMiddleware.params({
    id: Joi.number().integer().required(),
  }),
  validationMiddleware.body({
    name: Joi.string().required(),
    email: Joi.string(),
  }),
  async (ctx) => {
    const { id } = ctx.params;
    const { name, email } = ctx.request.body;

    if (parseInt(id) !== ctx.state.user.id) {
      ctx.status = 403;
      ctx.body = { message: "Forbidden: You can only update your own data" };
      return;
    }

    await usersRepo.updateUser(id, { name, email });
    ctx.status = 200;
    ctx.body = { message: "User updated successfully" };
  }
);

router.post(
  "/users",
  jwtCheck,
  authorizeAdmin,
  validationMiddleware.body({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
    role: Joi.string().trim().valid("student", "admin").required(),
  }),
  async (ctx) => {
    try {
      const user = await usersRepo.createUser(ctx.request.body);
      ctx.body = user;
      ctx.status = 201;
    } catch (err) {
      ctx.status = 400;
      ctx.body = { error: err.message };
    }
  }
);
module.exports = router;
