const jwt = require('jsonwebtoken')

async function jwtCheck (ctx, next) {
  const authToken = ctx.header.authorization?.split(' ')?.[1]
  const decoded = jwt.verify(authToken, process.env.JWT_SECRET)

  ctx.state.user = decoded

  return next()
}

module.exports = {
  jwtCheck,
}