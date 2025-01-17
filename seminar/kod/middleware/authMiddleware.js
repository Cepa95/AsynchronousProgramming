const jwt = require("jsonwebtoken");

//provjerava jwt token i dekodiran payload koji
// mi triba kao npr rola, da ne saljen stalno upite u
// bazu
async function jwtCheck(ctx, next) {
  const authHeader = ctx.header.authorization;
  if (!authHeader) {
    const error = new Error("Authorization header missing");
    error.status = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    const error = new Error("Bearer token missing");
    error.status = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (err) {
    const error = new Error("Invalid token");
    error.status = 403;
    throw error;
  }
}

//sada samo gledan jel mi u contextu objektu rola s vrijednosti admin
async function authorizeAdmin(ctx, next) {
  if (ctx.state.user.role !== "admin") {
    const error = new Error("Admin access required");
    error.status = 403;
    throw error;
  }
  return next();
}

module.exports = {
  jwtCheck,
  authorizeAdmin,
};
