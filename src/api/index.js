// imports section

import { Router } from 'express'
import posts from './posts.js'

// declarations section

const router = Router()

import { createRequire } from 'module'
const reqr = createRequire(import.meta.url)
const packageConfig = reqr('../../package.json')

router.get('/', (req, res) => {
  // redirects to api docs or send api info
  res.json({
    name: packageConfig.name,
    apiVersion: packageConfig.version,
    repository: packageConfig.repository,
    description: packageConfig.description,
    license: packageConfig.license,
    licenseUrl: packageConfig.licenseUrl,
  })
})

// API main routes

// Posts
router.use(`/posts`, posts)
// Users
// Media
// Comments
// Transactions

// Export the router

export default router
