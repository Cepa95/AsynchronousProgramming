require("dotenv-safe").config();
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const authRoutes = require("./route/auth")
const usersRoutes = require("./route/users");
const subjectsRoutes = require("./route/subjects")
const usersSubjecstRoutes = require("./route/users_subjects")
const swagger = require("./swagger-output.json");
const { koaSwagger } = require('koa2-swagger-ui');
const app = new Koa();

app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    ctx.status = err.status || 500;
    ctx.body = {
      err,
      message: err.message,
    };
  }
});

app.use(usersRoutes.routes())
app.use(authRoutes.routes())
app.use(subjectsRoutes.routes())
app.use(usersSubjecstRoutes.routes())


//http://localhost:4000/swagger sve lipo namisteno
//u swagger-output.jsonu
app.use(koaSwagger({
  routePrefix: '/swagger', 
  swaggerOptions: { spec: swagger },
}));



module.exports = app;


