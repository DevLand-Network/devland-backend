import { Router } from 'express';
import { getCollection } from '../db/driver.js';
import commonErrors from '../messages/error/http.js';
import { secureEndpoint } from '../security/token.js';
import { roleMiddleware } from '../security/roles.js';
import { serializeTargetUser } from '../security/ownership.js';
import posts from './posts.js';

const { notFound, internalServerError } = commonErrors;

const router = Router();

// GET /api/users - Get all users from the database (admin only)

router.get('/', secureEndpoint, roleMiddleware, async (req, res) => {
  const userCol = await getCollection('users');
  try {
    const users = await userCol.find({}).toArray();
    res.json(users);
  } catch (err) {
    res.status(500).send(internalServerError());
  }
});

// GET /api/users/:id - Get a user from the database (secure)

router.get('/profile', secureEndpoint, async (req, res) => {
  const {
    user: { publicKey },
  } = req;
  const collection = await getCollection('users');
  const userProfile = await collection.findOne({ publicKey });
  if (!userProfile) {
    return res.status(404).json(notFound('No user found for this profile'));
  }
  return res.json(userProfile);
});

// GET /api/users/:id - Get a user from the database (secure, limited)

// Remove secureEndpoint and roleMiddleware from this endpoint just check content rules

router.get('/:shortID', secureEndpoint, async (req, res) => {
  const { shortID } = req.params;
  const userCol = await getCollection('users');
  try {
    const user = await userCol.findOne({
      $or: [{ shortID }, { publicKey: shortID }, { username: shortID }],
    });
    if (user) return res.json(user);
    res.status(404).send(notFound('User not found'));
  } catch (err) {
    res.status(500).send(internalServerError(err));
  }
});

// USER API Main router

// GET /api/users/:id/posts - Get all posts from a user (secure)

// Target user serialization is used to set get any valid identifier of the target user like shortID, publicKey or username
// This costs db usage and must be removed and changed to a more efficient way (like a just one standard query)

router.use('/:shortID/posts', serializeTargetUser, posts);

export default router;
