import { Router } from 'express'
import { getCollection } from '../db/driver.js'
import commonErrors from '../errors/general.js'
import shortid from 'shortid'
import { validate } from '../models/posts.js'

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
  const { postID } = req.params
  try {
    const post = await postsCol.findOne({ postID })
    if (post) res.json(post)
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
    date: new Date().toString(),
    shortID: shortid.generate(),
  }
  const valid = validate(content)
  if (!valid) return res.status(400).json(badRequest(validate.errors))
  try {
    const post = await postsCol.insertOne(req.body)
    res.json(post)
  } catch (err) {
    res.status(500).json(internalServerError(err))
  }
})

export default router
