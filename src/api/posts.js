import { Router } from "express";
import shortid from "shortid";
import { validateCreation, validateUpdate } from "../models/posts.js";
import { getCollection } from "../db/driver.js";
import commonErrors from "../messages/error/http.js";
import { createSlug } from "../utils.js";

const { notFound, internalServerError, badRequest } = commonErrors;

const router = Router();

// get all posts

router.get("/", async (req, res) => {
  const { shortID } = req.user;
  const postsCol = await getCollection("posts");
  try {
    const posts = await postsCol.find({ owner: shortID }).toArray();
    res.json(posts);
  } catch (err) {
    res.status(500).json(internalServerError(err));
  }
});

//get post by id or slug

router.get("/:postID", async (req, res) => {
  const postsCol = await getCollection("posts");
  const { postID: shortID } = req.params;
  const { shortID: owner } = req.user;
  try {
    const post = await postsCol.findOne({
      $and: [{ $or: [{ shortID }, { slug: shortID }] }, { owner }],
    });
    if (post) return res.json(post);
    res.status(404).json(notFound("This post doesn\'t exist for this user"));
  } catch (err) {
    res.status(500).json(internalServerError(err));
  }
});

// create post

router.post("/", async (req, res) => {
  const { shortID: owner } = req.user;
  const postsCol = await getCollection("posts");
  const content = {
    ...req.body,
    owner,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    shortID: shortid.generate(),
    slug: createSlug(req.body.title) || "",
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

// edit post by id or slug

router.put("/:postID", async (req, res) => {
  const postsCol = await getCollection("posts");
  const { postID: shortID } = req.params;
  const { shortID: owner } = req.user;
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
      { returnOriginal: false },
    );
    if (post.value) return res.json(post.value);
    res.status(404).json(notFound("This post doesn\'t exist for this user"));
  } catch (err) {
    res.status(500).json(internalServerError(err));
  }
});

// delete post by id or slug

router.delete("/:postID", async (req, res) => {
  const postsCol = await getCollection("posts");
  const { postID: shortID } = req.params;
  const { shortID: owner } = req.user;
  try {
    const post = await postsCol.findOneAndDelete({ $and: [{ $or: [{ shortID }, { slug: shortID }] }, { owner }] });
    if (post.value) return res.json(post.value);
    res.status(404).json(notFound('This post doesn\'t exist for this user'));
  } catch (err) {
    res.status(500).json(internalServerError(err));
  }
});

export default router;
