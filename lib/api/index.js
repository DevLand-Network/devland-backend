// imports section

import { Router } from 'express'
import posts from './posts.js'

// declarations section

const router = Router()

router.get('/', (req, res) => {
  // redirects to api docs
  res.send('Hello World!')
})

// API main routes

// Posts
router.use(`/posts`, posts)

// Export the router

export default router
