const express = require('express')
const { registerRequest } = require('../controller/login')
const router = express.Router()

router.route('/').post(registerRequest)

module.exports = router
