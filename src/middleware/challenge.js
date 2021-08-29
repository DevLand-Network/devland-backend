import crypto from "crypto";
import {
  Account,
  Keypair,
  Networks,
  Operation,
  Server,
  TransactionBuilder,
} from "stellar-sdk";
import commonErrors from "../messages/error/http.js";
const serverSecret = process.env.SERVER_SECRET_KEY;
const serverKeyPair = Keypair.fromSecret(serverSecret);
const invalidSequence = "0";
const challengeExpireIn = 3000;
const HORIZON_URL = "https://horizon-testnet.stellar.org";

const server = new Server(HORIZON_URL);
// Stellar::Account representing the application's account, INVALID_SEQUENCE is used here to make sure this transaction
// will be invalid if submitted to real network
const account = new Account(
  serverKeyPair.publicKey(),
  invalidSequence,
);

// This random sequence is used to ensure that two challenge transactions generated at the same time will be different.
// In other words, it makes every challenge transaction unique.
const randomNonce = () => {
  return crypto.randomBytes(32).toString("hex");
};

// GET /auth => { transaction: "base64 tx xdr" }
export const challenge = async (req, res) => {
  // Public key of the client requesting access.
  const clientPublicKey = req.query.account;
  if (!clientPublicKey) {
    return res.status(400).send(commonErrors.badRequest("Missing account"));
  }
  // Transaction time bounds, current time..+300 seconds by default.
  // In other words, challenge transaction will expire in 5 minutes since it was generated.
  // This prevents replay attacks.
  const minTime = Date.now();
  const maxTime = minTime + challengeExpireIn;
  const timebounds = {
    minTime: minTime.toString(),
    maxTime: maxTime.toString(),
  };

  // ManageData operation, source represents an account that requests access to the service. Its signature will be
  // validated later.
  const op = Operation.manageData({
    source: clientPublicKey,
    name: "Sample auth",
    value: randomNonce(),
  });
  const fee = await server.fetchBaseFee();
  const tx = new TransactionBuilder(account, {
    timebounds,
    fee,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(op)
    .build();
  tx.sign(serverKeyPair); // Sign by server
  res.json({ transaction: tx.toEnvelope().toXDR("base64") });
  console.info(`${clientPublicKey} requested challenge => OK`);
};
