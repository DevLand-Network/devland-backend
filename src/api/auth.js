import { Router } from "express";
import shortid from "shortid";
import { getCollection } from "../db/driver.js";
import commonErrors from "../messages/error/http.js";
import { profileData, validateUserCreation } from "../models/users.js";
import { checkUsername, createFailMessage } from "../utils.js";
import StellarSDK from "stellar-sdk";
const { Keypair } = StellarSDK;
import { challenge } from "../middleware/challenge.js";
import { verify } from "../middleware/verify.js";
import { createStellarToken, verifyToken } from "../security/token.js";
import { getRole } from "../models/roles.js";

const { internalServerError, forbidden, badRequest, unauthorized } =
  commonErrors;

const serverSecret = process.env.SERVER_SECRET_KEY;
const serverKeyPair = Keypair.fromSecret(serverSecret);

const router = Router();

// AUTH METHODS

// Auth for Stellar SEP 0010 implementation

router.get("/stellar.json", async (req, res) => {
  res.json({
    endpoint: `${req.protocol}://${req.get("host")}/auth`,
    publicKey: serverKeyPair.publicKey(),
  });
});

//  GET /auth => Challenge generation

router.get("/", challenge);

// POST /auth => Verify and return user if exists else response with error
// TODO: Move the whole operation inside try/catch and perform db lookup first

router.post("/", verify);

// POST /auth/register => Create new user

router.post("/register", async (req, res) => {
  const collection = await getCollection("users");
  try {
    // validations
    const newUser = {
      ...req.body,
      shortID: shortid.generate(),
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      role: getRole("user"),
      ...profileData(req.body?.firstName, req.body?.lastName),
    };

    if (!validateUserCreation(newUser)) {
      return res.status(400).json(badRequest(validateUserCreation.errors));
    }
    const check = checkUsername(newUser.username);
    if (!check.status) {
      return res.status(400).json(badRequest(createFailMessage(check)));
    }

    const user = await collection.findOne({
      $or: [{ username: newUser.username }, { publicKey: newUser.publicKey }],
    });
    if (user) {
      return res.status(401).json(
        forbidden("User already exists, please try to login instead."),
      );
    }

    // create user

    await collection.insertOne(newUser);
    res.json(newUser);
  } catch (err) {
    return res.status(500).json(internalServerError(err));
  }
});

// POST /auth/refresh_token => Refresh JWT token
// The refresh token contains the same data as the access token, so we can use it to create a new access token

router.post("/refresh_token", async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json(unauthorized("No refresh token found"));
  }
  try {
    const { shortID, hash, publicKey, username, role } = await verifyToken(
      refreshToken,
    );
    if (!publicKey || !hash) {
      return res.status(401).json(unauthorized("Invalid refresh token"));
    }
    const token = createStellarToken(
      { shortID, publicKey, username, role },
      hash,
    );
    res.send({ token });
  } catch (err) {
    return res.status(401).json(err);
  }
});

export default router;
