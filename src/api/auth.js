/*

By now this is centralized proof of concept, in the future we should create a key-pair challenge authentication method with the following modules:

  - server-side: https://github.com/dolcalmi/stellar-auth-server
  - client-side: https://github.com/dolcalmi/stellar-auth-client

*/

import { Router } from 'express'
import shortid from 'shortid'
import { getCollection } from '../db/driver.js'
import commonErrors from '../messages/error/http.js'
import { createToken, createStellarToken } from '../security/token.js'
import { validateUserCreation, profileData } from '../models/users.js'
import { checkUsername, createFailMessage } from '../utils.js'
import StellarAuth from 'stellar-auth-server';
import StellarSDK from 'stellar-sdk'
const { Keypair } = StellarSDK;
import { challenge } from '../middleware/challenge.js'
import { verify } from '../middleware/verify.js'

const { internalServerError, forbidden, badRequest, unauthorized } = commonErrors;

const serverSecret = process.env.SERVER_SECRET_KEY;
const serverKeyPair = Keypair.fromSecret(serverSecret);
const authenticator = new StellarAuth(serverKeyPair)

const router = Router()

// AUTH METHODS

// Auth for Stellar SEP 0010 implementation

router.get('/stellar.json', async (req, res) => {
  res.json({ 
    endpoint: `${req.protocol}://${req.get('host')}/auth`,
    publicKey: serverKeyPair.publicKey()
  })
})

router.get('/', challenge)

router.post('/', verify)

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
  const collection = await getCollection('users');
  try {
    // validations
    const newUser = {
      shortID: shortid.generate(),
      ...req.body,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      role: 'user',
      profileData
    }

    if (!validateUserCreation(newUser)) return res.status(400).json(badRequest(validateUserCreation.errors))
    const check = checkUsername(newUser.username);
    if (!check.status) return res.status(400).json(badRequest(createFailMessage(check)))

    const user = await collection.findOne({ $or: [{ username: newUser.username }, { publicKey: newUser.publicKey }] })
    if (user) return res.status(401).json(forbidden('User already exists, please try to login instead.'))

    // create user

    await collection.insertOne(newUser)
    //const token = createToken({ email, password, shortID: newUser.shortID })
    res.json(newUser)
  } catch (err) {
    return res.status(500).json(internalServerError(err))
  }
})

export default router
