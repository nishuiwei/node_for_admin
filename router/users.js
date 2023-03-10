const express = require('express')
const { getUsersRequest } = require('../controller/users')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/').get(protect, getUsersRequest)

module.exports = router
