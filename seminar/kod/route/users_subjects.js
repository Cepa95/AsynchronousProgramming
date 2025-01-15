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
      const error = new Error(err.message);
      error.status = 400;
      throw error;
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
      const error = new Error("Forbidden: You can only see your own data");
      error.status = 403;
      throw error;
    }
    try {
      const subjects = await usersSubjectsRepo.getSubjectsByUserId(id);
      ctx.body = subjects;
    } catch (err) {
      const error = new Error(err.message);
      error.status = 400;
      throw error;
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
      const error = new Error(err.message);
      error.status = 400;
      throw error;
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
      const error = new Error(err.message);
      error.status = 400;
      throw error;
    }
  }
);

module.exports = router;
