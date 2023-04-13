const express = require('express')
const {
	getTodoListRequest,
	setTodoItemRequest,
	removeTodoItemRequest,
	editTodoItemRequest,
	starTodoItemRequest,
} = require('../controller/todos')
const router = express.Router()

router.route('/').get(getTodoListRequest).post(setTodoItemRequest)
router.route('/:id').delete(removeTodoItemRequest).patch(editTodoItemRequest)
router.route('/star/:id').patch(starTodoItemRequest)

module.exports = router
