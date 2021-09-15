import { Router } from 'express';
import shortid from 'shortid';
import { validateCreation, validateUpdate } from '../models/posts.js';
import { getCollection } from '../storage/database.js';
import commonErrors from '../messages/error/http.js';
import { createSlug } from '../utils.js';
import { protectedByOwnership } from '../security/ownership.js';
import { secureEndpoint } from '../security/token.js';

const { notFound, internalServerError, badRequest } = commonErrors;

// Important to note that mergeParams is used to get the params from the parent route

const router = Router({ mergeParams: true });

// GET /api/posts/ - Get all posts

router.get('/', async (req, res) => {
  const { shortID } = req.targetUser;
  const postsCol = await getCollection('posts');
  try {
    const posts = await postsCol.find({ owner: shortID }).toArray();
    res.json(posts);
  } catch (err) {
    res.status(500).json(internalServerError(err));
  }
});

// GET /api/posts/:postID - Get post by id or slug from this user

router.get('/:postID', async (req, res) => {
  const postsCol = await getCollection('posts');
  const { postID: shortID } = req.params;
  const { shortID: owner } = req.targetUser;
  try {
    const post = await postsCol.findOne({
      $and: [{ $or: [{ shortID }, { slug: shortID }] }, { owner }],
    });
    if (post) return res.json(post);
    res.status(404).json(notFound("This post doesn't exist for this user"));
  } catch (err) {
    res.status(500).json(internalServerError(err));
  }
});

// POST /api/posts/ - Create a new post for this user

router.post('/', secureEndpoint, protectedByOwnership, async (req, res) => {
  const { shortID: owner } = req.targetUser;
  const postsCol = await getCollection('posts');
  const content = {
    ...req.body,
    owner,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    shortID: shortid.generate(),
    slug: createSlug(req.body.title) || '',
  };
  if (!validateCreation(content)) {
    return res.status(400).json(badRequest(validateCreation.errors));
  }
  try {
    const checkIfSlugExists = await postsCol.findOne({ slug: content.slug });
    if (checkIfSlugExists) content.slug = `${content.slug}-${content.shortID}`;
  } catch (err) {
    res.status(500).json(internalServerError(err));
  }
  try {
    const post = await postsCol.insertOne(content);
    res.json({ ...post, content });
  } catch (err) {
    res.status(500).json(internalServerError(err));
  }
});

// PATCH /api/posts/:postID - Edit post by id or slug for this user (granular)

router.patch('/:postID', secureEndpoint, protectedByOwnership, async (req, res) => {
  const postsCol = await getCollection('posts');
  const { postID: shortID } = req.params;
  const { shortID: owner } = req.targetUser;
  const content = {
    ...req.body,
    updatedAt: new Date().toString(),
  };
  if (!validateUpdate(content)) {
    return res.status(400).json(badRequest(validateCreation.errors));
  }
  try {
    const post = await postsCol.findOneAndUpdate(
      { $and: [{ $or: [{ shortID }, { slug: shortID }] }, { owner }] },
      { $set: { ...content } },
      { returnOriginal: false }
    );
    if (post.value) return res.json(post.value);
    res.status(404).json(notFound("This post doesn't exist for this user"));
  } catch (err) {
    res.status(500).json(internalServerError(err));
  }
});

// DELETE /api/posts/:postID - Delete post by id or slug for this user

router.delete('/:postID', secureEndpoint, protectedByOwnership, async (req, res) => {
  const postsCol = await getCollection('posts');
  const { postID: shortID } = req.params;
  const { shortID: owner } = req.targetUser;
  try {
    const post = await postsCol.findOneAndDelete({ $and: [{ $or: [{ shortID }, { slug: shortID }] }, { owner }] });
    if (post.value) return res.json(post.value);
    res.status(404).json(notFound("This post doesn't exist for this user"));
  } catch (err) {
    res.status(500).json(internalServerError(err));
  }
});

export default router;
