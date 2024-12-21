const Router = require("@koa/router");
const Joi = require("joi");
const subjectRepo = require("../repo/subjects");
const { jwtCheck, authorizeAdmin } = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validate");

const router = new Router();

router.get("/subjects", async (ctx) => {
  const subjects = await subjectRepo.getSubjects();
  ctx.body = subjects;
});

router.delete(
  "/subjects/:id",
  jwtCheck,
  authorizeAdmin,
  validationMiddleware.params({
    id: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const { id } = ctx.params;
    await subjectRepo.deleteSubject(id);
    ctx.status = 204;
  }
);

router.put(
  "/subjects/:id",
  jwtCheck,
  authorizeAdmin,
  validationMiddleware.params({
    id: Joi.number().integer().required(),
  }),
  validationMiddleware.body({
    name: Joi.string().required(),
    ects: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const { id } = ctx.params;
    const { name, ects } = ctx.request.body;
    const subject = await subjectRepo.getSubjectById(id);
    if (!subject) {
      ctx.status = 404;
      ctx.body = { message: "Subject not found" };
      return;
    }
    await subjectRepo.updateSubject(id, { name, ects });
    ctx.status = 200;
    ctx.body = { message: "Subject updated successfully" };
  }
);

router.post(
  "/subjects",
  jwtCheck,
  authorizeAdmin,
  validationMiddleware.body({
    name: Joi.string().required(),
    ects: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const { name, ects } = ctx.request.body;
    const newSubject = await subjectRepo.createSubject({ name, ects });
    ctx.status = 201;
    ctx.body = {
      message: "Subject created successfully",
      subject: newSubject,
    };
  }
);

module.exports = router;
