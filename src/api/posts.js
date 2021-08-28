import { Router } from 'express'
import shortid from 'shortid'
import { validateCreation, validateUpdate } from '../models/posts.js'
import { getCollection } from '../db/driver.js'
import commonErrors from '../messages/error/http.js'

const { notFound, internalServerError, badRequest } = commonErrors

const router = Router()

// get all posts

router.get('/', async (req, res) => {
  const postsCol = await getCollection('posts')
  try {
    const posts = await postsCol.find({}).toArray()
    res.json(posts)
  } catch (err) {
    res.status(500).json(internalServerError(err))
  }
})

//get post by id

router.get('/:postID', async (req, res) => {
  const postsCol = await getCollection('posts')
  const { postID: shortID } = req.params
  try {
    const post = await postsCol.findOne({ shortID })
    if (post) return res.json(post)
    res.status(404).json(notFound())
  } catch (err) {
    res.status(500).json(internalServerError(err))
  }
})

// create post

router.post('/', async (req, res) => {
  const postsCol = await getCollection('posts')
  const content = {
    ...req.body,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    shortID: shortid.generate(),
  }
  if (!validateCreation(content)) return res.status(400).json(badRequest(validateCreation.errors))
  try {
    const post = await postsCol.insertOne(content)
    res.json({ ...post, content })
  } catch (err) {
    res.status(500).json(internalServerError(err))
  }
})

// edit post

router.put('/:postID', async (req, res) => {
  const postsCol = await getCollection('posts')
  const { postID: shortID } = req.params
  const content = {
    ...req.body,
    updatedAt: new Date().toString(),
  }
  if (!validateUpdate(content)) return res.status(400).json(badRequest(validateCreation.errors))
  try {
    const post = await postsCol.findOneAndUpdate({ shortID }, { $set: content }, { returnOriginal: false })
    if (post.value) return res.json(post.value)
    res.status(404).json(notFound())
  } catch (err) {
    res.status(500).json(internalServerError(err))
  }
})

// delete post

router.delete('/:postID', async (req, res) => {
  const postsCol = await getCollection('posts')
  const { postID: shortID } = req.params
  try {
    const post = await postsCol.findOneAndDelete({ shortID })
    if (post.value) return res.json(post.value)
    res.status(404).json(notFound())
  } catch (err) {
    res.status(500).json(internalServerError(err))
  }
})

export default router
