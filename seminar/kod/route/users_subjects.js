const Router = require("@koa/router");
const Joi = require("joi");
const { jwtCheck, authorizeAdmin } = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validate");
const usersSubjectsRepo = require("../repo/users_subjects");

const router = new Router();

router.get(
  "/subjects/:id/users",
  jwtCheck,
  authorizeAdmin,
  validationMiddleware.params({
    id: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const { id } = ctx.params;
    try {
      const users = await usersSubjectsRepo.getUsersBySubjectId(id);
      ctx.body = users;
    } catch (err) {
      ctx.status = 400;
      ctx.body = { error: err.message };
    }
  }
);

router.get(
  "/users/:id/subjects",
  jwtCheck,
  validationMiddleware.params({
    id: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const { id } = ctx.params;
    if (parseInt(id) !== ctx.state.user.id) {
      ctx.status = 403;
      ctx.body = { message: "Forbidden: You can only see your own data" };
      return;
    }
    try {
      const subjects = await usersSubjectsRepo.getSubjectsByUserId(id);
      ctx.body = subjects;
    } catch (err) {
      ctx.status = 400;
      ctx.body = { error: err.message };
    }
  }
);

router.post(
  "/subjects/:id/add",
  jwtCheck,
  validationMiddleware.params({
    id: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const { id: subjectId } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      await usersSubjectsRepo.addUserToSubject(userId, subjectId);
      ctx.status = 201;
      ctx.body = { message: "User added to subject successfully" };
    } catch (err) {
      ctx.status = 400;
      ctx.body = { error: err.message };
    }
  }
);

router.delete(
  "/subjects/:id/remove",
  jwtCheck,
  validationMiddleware.params({
    id: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const { id: subjectId } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      await usersSubjectsRepo.removeUserFromSubject(userId, subjectId);
      ctx.status = 200;
      ctx.body = { message: "User removed from subject successfully" };
    } catch (err) {
      ctx.status = 400;
      ctx.body = { error: err.message };
    }
  }
);

module.exports = router;
