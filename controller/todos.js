const asyncHandler = require('express-async-handler')
const TodoList = require('../schemas/todoListSchemas')

const typeMap = {
	Backend: 'info',
	Work: 'warning',
	Project: 'danger',
	Issue: 'success',
	Frontkend: '',
}

/**
 *  @method POST
 *  @route /api/todos
 *  @description 获取任务列表
 *  @access PRIVATE
 */

const setTodoItemRequest = asyncHandler(async (req, res) => {
	const { title, label_type, notes } = req.body

	const label_types = label_type.map((item) => {
		if (!item) return
		return {
			type: typeMap[item],
			title: item,
		}
	})
	const result = await TodoList.create({
		title,
		label_type: label_types,
		notes,
		is_star: false,
	})
	res.status(200).json({
		success: true,
		data: result,
		message: '添加成功',
	})
})

/**
 *  @method DELETE
 *  @route /api/todos/:id
 *  @description 删除任务列表
 *  @access PRIVATE
 */

const removeTodoItemRequest = asyncHandler(async (req, res) => {
	const id = req.params.id
	const result = await TodoList.findById(id)

	if (!result) {
		res.status(400).json({
			code: 400,
			message: '未查询到该信息',
		})
		throw new Error('未查询到该信息')
	}
	await result.deleteOne()
	res.status(200).json({
		success: true,
		message: '删除成功',
	})
})

/**
 *  @method PATCH
 *  @route /api/todos/:id
 *  @description 编辑任务列表
 *  @access PRIVATE
 */

const editTodoItemRequest = asyncHandler(async (req, res) => {
	const id = req.params.id
	const { title, label_type, notes } = req.body

	const label_types = label_type.map((item) => {
		if (!item) return
		return {
			type: typeMap[item],
			title: item,
		}
	})

	const result = await TodoList.findById(id)

	if (!result) {
		res.status(400).json({
			code: 400,
			message: '未查询到该信息',
		})
		throw new Error('未查询到该信息')
	}

	const todoItem = {
		title,
		label_type: label_types,
		notes,
	}

	await result.updateOne(todoItem)

	res.status(200).json({
		success: true,
		message: '编辑成功',
		data: todoItem,
	})
})

/**
 *  @method PATCH
 *  @route /api/todos/star/:id
 *  @description 星标任务列表
 *  @access PRIVATE
 */

const starTodoItemRequest = asyncHandler(async (req, res) => {
	const id = req.params.id
	const { is_star } = req.body

	const result = await TodoList.findById(id)

	if (!result) {
		res.status(400).json({
			code: 400,
			message: '未查询到该信息',
		})
		throw new Error('未查询到该信息')
	}

	result.is_star = is_star

	await result.save()

	res.status(200).json({
		success: true,
		message: '编辑成功',
		data: result,
	})
})

/**
 *  @method GET
 *  @route /api/todos
 *  @description 获取任务列表
 *  @access PRIVATE
 */

const getTodoListRequest = asyncHandler(async (req, res) => {
	const result = await TodoList.find({})
	if (!result) {
		res.status(400).json({
			success: false,
			code: 400,
			message: '系统出现错误，请稍后再试',
		})
	}
	res.status(200).json({
		success: true,
		data: {
			list: result,
			totalCount: result.length,
		},
	})
})

module.exports = {
	setTodoItemRequest,
	removeTodoItemRequest,
	editTodoItemRequest,
	starTodoItemRequest,
	getTodoListRequest,
}
