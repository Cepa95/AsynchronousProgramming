const jwt = require("jsonwebtoken");

//provjerava jwt token i dekodiran payload koji
// mi triba kao npr rola, da ne saljen stalno upite u
// bazu
async function jwtCheck(ctx, next) {
  const authHeader = ctx.header.authorization;
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { error: "Authorization header missing" };
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Bearer token missing" };
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (err) {
    ctx.status = 403;
    ctx.body = { error: "Invalid token" };
  }
}

//sada samo gledan jel mi u contextu objektu rola s vrijednosti admin
async function authorizeAdmin(ctx, next) {
  if (ctx.state.user.role !== "admin") {
    ctx.status = 403;
    ctx.body = { error: "Admin access required" };
    return;
  }
  return next();
}

module.exports = {
  jwtCheck,
  authorizeAdmin,
};
