import { Router } from 'express'
import { getCollection } from '../db/driver.js'
import commonErrors from '../messages/error/http.js'
import { secureEndpoint } from '../security/token.js'
import { roleMiddleware } from '../security/roles.js'
import posts from './posts.js'

const { notFound, internalServerError } = commonErrors

const router = Router()

// GET /api/users - Get all users from the database (admin only)

router.get('/', secureEndpoint, roleMiddleware, async (req, res) => {
  const userCol = await getCollection('users')
  try {
    const users = await userCol.find({}).toArray()
    res.json(users)
  } catch (err) {
    res.status(500).send(internalServerError())
  }
})

// GET /api/users/:id - Get a user from the database (secure)

router.get('/profile', secureEndpoint, async (req, res) => {
  const {
    user: { publicKey },
  } = req
  const collection = await getCollection('users')
  const userProfile = await collection.findOne({ publicKey })
  if (!userProfile) {
    return res.status(404).json(notFound('No user found for this profile'))
  }
  return res.json(userProfile)
})

// GET /api/users/:id - Get a user from the database (secure, limited)

// Remove secureEndpoint and roleMiddleware from this endpoint just check content rules

router.get('/:shortID', secureEndpoint, async (req, res) => {
  const { shortID } = req.params
  const userCol = await getCollection('users')
  try {
    const user = await userCol.findOne({ $or: [{ shortID }, { publicKey: shortID }, { username: shortID }] })
    if (user) return res.json(user)
    res.status(404).send(notFound('User not found'))
  } catch (err) {
    res.status(500).send(internalServerError(err))
  }
})

// USER API Main router

// User posts

router.use('/:shortID/posts', async (req, res, next) => {
  const { shortID } = req.params
  try {
    const userCol = await getCollection('users')
    const user = await userCol.findOne({ $or: [{ shortID }, { publicKey: shortID }, { username: shortID }] })
    if (!user) {
      return res.status(404).send(notFound('User not found'))
    }
    req.user = user;
    next()
  } catch (err) {
    return res.status(500).send(internalServerError(err))
  }
}, posts)

export default router
