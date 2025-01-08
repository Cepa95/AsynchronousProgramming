const resourceLocks = require("../repo/resourceLocks");

async function lockingMiddleware(ctx, next) {
  const { resource_type, resource_id } = ctx.state.lockingInfo;
  const user_id = ctx.state.user.id;

  const isLocked = await resourceLocks.isResourceLocked(resource_type, resource_id);

  if (isLocked) {
    const lock = await resourceLocks.getLock(resource_type, resource_id);
    if (lock.user_id === user_id) {
      return next();
    } else {
      const error = new Error("Resource locked!");
      error.status = 403;
      throw error;
      
    }
  } else {
    return next();
  }
}

module.exports = lockingMiddleware;