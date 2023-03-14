const express = require('express')
const { getMenusRequest } = require('../controller/menus')
const router = express.Router()

router.route('/').get(getMenusRequest)

module.exports = router
