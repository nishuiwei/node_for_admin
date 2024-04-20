const express = require('express')
const {
	getMenusRequest,
	setMenusRequest,
	removeMenusRequest,
	editMenusRequest,
} = require('../controller/menus')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/').get(protect, getMenusRequest).post(setMenusRequest)
router.route('/:id').delete(removeMenusRequest).patch(editMenusRequest)

module.exports = router
