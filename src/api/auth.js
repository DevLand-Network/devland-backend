/*

By now this is centralized proof of concept, in the future we should create a key-pair challenge authentication method with the following modules:

  - server-side: https://github.com/dolcalmi/stellar-auth-server
  - client-side: https://github.com/dolcalmi/stellar-auth-client

*/

import { Router } from 'express'
import shortid from 'shortid'
import { getCollection } from '../db/driver.js'
import commonErrors from '../errors/http.js'
import { createToken } from '../security/token.js'
import { validateUserCreation } from '../models/users.js'
import { checkEmail } from '../utils.js'

const { internalServerError, forbidden, badRequest, unauthorized } = commonErrors

const router = Router()

// AUTH METHODS

// Login

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const collection = await getCollection('users')
  try {
    const user = await collection.findOne({ email }, { projection: { _id: 0, password: 1, email: 1, shortID: 1 } })
    if (!user) {
      return res.status(401).json(unauthorized('Invalid password or username'))
    }
    if (user.password !== password) {
      return res.status(401).json(unauthorized('Invalid password or username'))
    }
    const token = createToken(user)
    res.json({
      token,
    })
  } catch (err) {
    return res.status(500).json(internalServerError(err))
  }
})

// Register

router.post('/register', async (req, res) => {
  const { email, password } = req.body
  const collection = await getCollection('users')
  try {
    // validations
    const newUser = {
      ...req.body,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      role: 'user',
      shortID: shortid.generate(),
    }

    if (!validateUserCreation(newUser)) return res.status(400).json(badRequest(validateUserCreation.errors))
    if (!checkEmail(email)) return res.status(400).json(badRequest('Invalid email'))

    const user = await collection.findOne({ email })
    if (user) return res.status(401).json(forbidden('Email already exists'))

    // create user

    await collection.insertOne(newUser)
    const token = createToken({ email, password, shortID: newUser.shortID })
    res.json({
      token: token,
    })
  } catch (err) {
    return res.status(500).json(internalServerError(err))
  }
})

export default router
