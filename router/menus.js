const express = require('express')
const {
	getMenusRequest,
	setMenusRequest,
	removeMenusRequest,
} = require('../controller/menus')
const router = express.Router()

router.route('/').get(getMenusRequest).post(setMenusRequest)
router.route('/:id').delete(removeMenusRequest)

module.exports = router
