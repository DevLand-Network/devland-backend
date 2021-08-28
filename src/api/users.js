import { Router } from 'express'
import { getCollection } from '../db/driver.js'
import commonErrors from '../messages/error/http.js'
import { secureEndpoint } from '../security/token.js'

const { notFound, internalServerError } = commonErrors

const router = Router()

router.get('/', async (req, res) => {
  const userCol = await getCollection('users')
  try {
    const users = await userCol.find({}).toArray()
    res.json(users)
  } catch (err) {
    res.status(500).send(internalServerError())
  }
})

router.get('/:shortID', secureEndpoint, async (req, res) => {
  const { shortID } = req.params
  const userCol = await getCollection('users')
  try {
    const user = await userCol.findOne({ shortID })
    if (user) return res.json(user)
    res.status(404).send(notFound())
  } catch (err) {
    res.status(500).send(internalServerError())
  }
})

export default router
