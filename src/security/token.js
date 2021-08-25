import jwt from 'jsonwebtoken'
import { config as dotenv } from 'dotenv'
import commonErrors from '../errors/http.js'

const { forbidden } = commonErrors

dotenv()

const jwtSecret = process.env.JWT_SECRET

export const createToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    expiresIn: '15d',
  })
}

export const createStellarToken = (publicKey, hash) => {
  return jwt.sign({
    publicKey
  }, hash, {
    expiresIn: '15d',
  })
}

export const secureEndpoint = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret)
      req.user = decoded
      return next()
    } catch (err) {
      res.status(403).send(forbidden(err))
    }
  }
  res.status(401).send(forbidden('Unauthorized'))
}