import jwt from "jsonwebtoken";
import { config as dotenv } from "dotenv";
import commonErrors from "../messages/error/http.js";

const { forbidden } = commonErrors;

dotenv();

const jwtSecret = process.env.JWT_SECRET;

export const creatRefreshToken = (publicKey, hash, expiration) => {
  const token = jwt.sign({ publicKey, hash }, jwtSecret, {
    expiresIn: expiration,
  });
  return token;
};

export const createStellarToken = (publicKey, hash) => {
  return jwt.sign(
    {
      jwtid: hash,
      publicKey,
    },
    jwtSecret,
    {
      expiresIn: '5m',
    },
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

export const secureEndpoint = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).send(forbidden(err));
    }
  }
  return res.status(401).send(forbidden("Unauthorized"));
};
