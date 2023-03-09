const express = require('express')
const { loginRequest } = require('../controller/login')
const router = express.Router()

router.route('/').post(loginRequest)

module.exports = router
