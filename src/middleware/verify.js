import { Keypair, Transaction, Networks } from "stellar-sdk";
import commonErrors from "../messages/error/http.js";
const serverSecret = process.env.SERVER_SECRET_KEY;
const serverKeyPair = Keypair.fromSecret(serverSecret);
const allowedAccounts = (process.env.ALLOWED_ACCOUNTS || "").split(",");
import { createStellarToken } from "../security/token.js";

const { unauthorized, gatewayTimeout, forbidden } = commonErrors;

export const verify = (req, res) => {
  const tx = new Transaction(req.body.transaction, Networks.TESTNET);
  const op = tx.operations[0];
  const { signatures } = tx;
  const hash = tx.hash();

  // Source account is a server's key pair
  if (tx.source != serverKeyPair.publicKey()) {
    return res.status(401).json(unauthorized("Invalid source account."));
  }

  // Challenge transaction was generated by server
  if (
    !signatures.some((signature) =>
      serverKeyPair.verify(hash, signature.signature())
    )
  ) {
    return res.status(401).json(
      unauthorized("Server signature is missing or invalid."),
    );
  }
  

  // Challenge transaction is not expired
  if (
    !(
      tx.timeBounds &&
      Date.now() > Number.parseInt(tx.timeBounds.minTime, 10) &&
      Date.now() < Number.parseInt(tx.timeBounds.maxTime, 10)
    )
  ) {
    return res.status(504).json(
      gatewayTimeout("Challenge transaction is expired."),
    );
  }

  // Challenge transaction has manageData operation
  if (op.type != "manageData") {
    return res.status(403).json(forbidden("Challenge transaction is invalid."));
  }

  // Source account present
  if (!op.source) {
    return res.status(403).json(forbidden("Challenge has no source account."));
  }

  const clientKeyPair = Keypair.fromPublicKey(op.source);

  // Challenge transaction was signed by the client
  if (
    !signatures.some((signature) =>
      clientKeyPair.verify(hash, signature.signature())
    )
  ) {
    return res.status(403).json(forbidden("Client signature is missing or invalid."));
  }

  // Implement allowed accounts in the future

  // Check that an access from this account is allowed
  // if (allowedAccounts.indexOf(op.source)) {
  //   console.info(
  //     `${op.source} requested token => access denied, check ALLOWED_ACCOUNTS`,
  //   );
  //   return res.status(403).json(forbidden(`${op.source} access denied.`));
  // }

  console.info(`${op.source} requested token => OK`);

  const token = createStellarToken({
    publicKey: clientKeyPair.publicKey(),
    jwtid: tx.hash().toString("hex"),
  });

  res.json({ token: token });
};
