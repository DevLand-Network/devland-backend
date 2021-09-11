#!/usr/bin/env node

import { Command } from 'commander/esm.mjs';
import { createUser } from './src/models/roles.js';
import { StrKey } from 'stellar-sdk'
import { checkUsername } from './src/utils.js';
import shortid from 'shortid';
import { getRole } from './src/models/roles.js';
import { validateUserCreation, profileData } from './src/models/users.js';
import ora from 'ora';
import spinners from 'cli-spinners';

const { dots } = spinners;

const program = new Command();

program
  .requiredOption('-u, --username <username>', 'Username')
  .requiredOption('-p, --publicKey <publicKey>', 'Stellar Public Key')
  .option('-n --name <name>', 'First Name' )
  .option('-l --lastName <lastNAme>', 'Last Name' )

program.parse(process.argv);

const spinner = ora({
  text: 'Doing some checks...',
  color: 'yellow',
  spinner: dots
}).start();

if (!StrKey.isValidEd25519PublicKey(program.opts().publicKey)) {
  console.error('Invalid Public Key');
  process.exit(1);
}

if (!checkUsername(program.opts().username)) {
  console.error('Invalid Username');
  process.exit(1);
}

const opts = program.opts();

spinner.text = 'Creating user...';
spinner.color = 'green';

const newUser = {
  username: opts.username,
  publicKey: opts.publicKey,
  firstName: opts.name || '',
  lastName: opts.lastName || '',
  shortID: shortid.generate(),
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  role: getRole("superUser"),
  ...profileData(opts?.name, opts?.lastName),
};

if (!validateUserCreation(newUser)) {
  console.error('Invalid User: ', JSON.stringify(validateUserCreation.errors, null, 2));
  process.exit(1);
}

spinner.text = 'Inserting user on database';
spinner.color = 'green';

try {
  const user = await createUser(newUser);
  console.log('Super user created:');
  console.log('Document: ', JSON.stringify(newUser, null, 2));
  console.log('Mongo ref: ', JSON.stringify(user, null, 2));
  spinner.stop();
  process.exit(0);
} catch (err) {
  spinner.fail();
  console.error(err);
  process.exit(1);
}