const db = require("../db");

async function lockResource(resourceType, resourceId, userId) {
  try {
    await db("resource_locks").insert({
      resource_type: resourceType,
      resource_id: resourceId,
      user_id: userId,
    });
  } catch (error) {
    throw new Error("Resource is already locked");
  }
}

async function unlockResource(resourceType, resourceId, userId) {
  const result = await db("resource_locks")
    .where({
      resource_type: resourceType,
      resource_id: resourceId,
      user_id: userId,
    })
    .del();
  if (result === 0) {
    throw new Error("Resource not locked by this user");
  }
}

async function isResourceLocked(resourceType, resourceId) {
  const lock = await db("resource_locks")
    .where({
      resource_type: resourceType,
      resource_id: resourceId,
    })
    .first();
  return !!lock;
}

async function getLock(resourceType, resourceId) {
  return await db("resource_locks")
    .where({
      resource_type: resourceType,
      resource_id: resourceId,
    })
    .first();
}

module.exports = {
  lockResource,
  unlockResource,
  isResourceLocked,
  getLock
};
