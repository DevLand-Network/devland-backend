import { Router } from 'express'
import shortid from 'shortid'
import { getCollection } from '../db/driver.js'
import commonErrors from '../messages/error/http.js'
import { validateUserCreation, profileData } from '../models/users.js'
import { checkUsername, createFailMessage } from '../utils.js'
import StellarSDK from 'stellar-sdk'
const { Keypair } = StellarSDK;
import { challenge } from '../middleware/challenge.js'
import { verify } from '../middleware/verify.js'
import { verifyToken, createStellarToken } from '../security/token.js'

const { internalServerError, forbidden, badRequest, unauthorized } = commonErrors;

const serverSecret = process.env.SERVER_SECRET_KEY;
const serverKeyPair = Keypair.fromSecret(serverSecret);

const router = Router()

// AUTH METHODS

// Auth for Stellar SEP 0010 implementation

router.get('/stellar.json', async (req, res) => {
  res.json({ 
    endpoint: `${req.protocol}://${req.get('host')}/auth`,
    publicKey: serverKeyPair.publicKey()
  })
})

// Challenge generation

router.get('/', challenge)

// Challenge verification

router.post('/', verify)

// Login

router.post('/login', async (req, res) => {
  const { publicKey } = req.body
  const collection = await getCollection('users')
  try {
    const user = await collection.findOne({ publicKey }, { projection: { _id: 0, publicKey: 1, username: 1, shortID: 1 } })
    if (!user) {
      return res.status(401).json(unauthorized("User doesn't exist, please try to register"))
    }
    res.json(user)
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
    res.json(newUser)
  } catch (err) {
    return res.status(500).json(internalServerError(err))
  }
})

router.post('/refresh_token', async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json(unauthorized('No refresh token found'))
  try {
    const { publicKey, hash } = await verifyToken(refreshToken);
    if (!publicKey || !hash) return res.status(401).json(unauthorized('Invalid refresh token'));
    const token = createStellarToken(publicKey,  hash);
    res.send({ token })
  } catch (err) {
    return res.status(401).json(err)
  }
})

export default router
