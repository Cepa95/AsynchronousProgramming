const jwt = require("jsonwebtoken");

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
    ctx.state.user = { id: decoded.id };
    return next();
  } catch (err) {
    const error = new Error("Invalid token");
    error.status = 403;
    throw error;
  }
}

module.exports = {
  jwtCheck,
};