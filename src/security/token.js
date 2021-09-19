import jwt from 'jsonwebtoken';
import { config as dotenv } from 'dotenv';
import commonErrors from '../messages/error/http.js';

const { forbidden, unauthorized } = commonErrors;

dotenv();

const jwtSecret = process.env.JWT_SECRET;

export const creatRefreshToken = (user, hash, expiration) => {
  const token = jwt.sign({ ...user, hash }, jwtSecret, {
    expiresIn: expiration,
  });
  return token;
};

export const createStellarToken = (user, hash) => {
  return jwt.sign(
    {
      jwtid: hash,
      ...user,
    },
    jwtSecret,
    {
      expiresIn: '5m',
    }
  );
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return reject(forbidden(err));
      }
      return resolve(decoded);
    });
  });
};

// Middleware to verify the token

export const secureEndpoint = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).send(unauthorized(err));
    }
  }
  return res.status(401).send(unauthorized('Unauthorized'));
};
