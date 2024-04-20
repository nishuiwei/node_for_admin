const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const {
	setEmailRequest,
	setEmailSecretRequest,
} = require('./../controller/email')
const router = express.Router()

router.route('/').post(protect, setEmailRequest)
router.route('/serect').post(protect, setEmailSecretRequest)

module.exports = router
