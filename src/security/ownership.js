import { getCollection } from '../db/driver.js';

// A middleware that checks if user in request can access this endpoint

export const protectedByOwnership = (req, res, next) => {
  const { shortID: userIdentifier } = req.params;
  const { user } = req;
  if (user.shortID === userIdentifier || user.username === userIdentifier || user.publicKey === userIdentifier) {
    return next();
  }
  return res.status(403).json({
    status: 403,
    error: 'You are not allowed to access this endpoint',
  });
};

// Middleware that serializes the target user into the request object

export const serializeTargetUser = async (req, res, next) => {
  const { shortID } = req.params;
  try {
    const userCol = await getCollection('users');
    const user = await userCol.findOne(
      { $or: [{ shortID }, { publicKey: shortID }, { username: shortID }] },
      { projection: { _id: 0, shortID: 1, username: 1, publicKey: 1 } }
    );
    if (!user) {
      return res.status(404).send(notFound("This user doesn't exist"));
    }
    req.targetUser = user;
    next();
  } catch (err) {
    return res.status(500).send(internalServerError(err));
  }
};
