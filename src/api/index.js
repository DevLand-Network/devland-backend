// imports section

import { Router } from 'express';
import posts from './posts.js';
import users from './users.js';
import auth from './auth.js';

// declarations section

const router = Router();

import { createRequire } from 'module';
const reqr = createRequire(import.meta.url);
const packageConfig = reqr('../../package.json');

router.get('/', (req, res) => {
  // redirects to api docs or send api info
  res.json({
    name: packageConfig.name,
    apiVersion: packageConfig.version,
    repository: packageConfig.repository,
    description: packageConfig.description,
    license: packageConfig.license,
    licenseUrl: packageConfig.licenseUrl,
  });
});

// API main routes

// Authorization routes
router.use(`/auth`, auth);
// Users
router.use(`/users`, users);
// Media
// Comments
// Transactions: Transaction automatization

// Export the router

export default router;
