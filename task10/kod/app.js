require("dotenv-safe").config();
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const authorsRoutes = require("./route/authors");
const songsRoutes = require("./route/songs");
const authorSongsRoutes = require("./route/author_songs");
const usersRoutes = require("./route/users");
const locksRoutes = require("./route/resourceLocks")
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
app.use(authorsRoutes.routes());
app.use(songsRoutes.routes());
app.use(authorSongsRoutes.routes());
app.use(usersRoutes.routes())
app.use(locksRoutes.routes())

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

module.exports = app;


