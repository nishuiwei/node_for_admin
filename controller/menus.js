const asyncHandler = require('express-async-handler')
const Menus = require('../schemas/menuSchemas')

/**
 *  @method POST
 *  @route /api/menus
 *  @description 添加菜单
 *  @access PRIVATE
 */

const setMenusRequest = asyncHandler(async (req, res) => {
	const {
		menu_code,
		title,
		index,
		icon,
		meta_title,
		meta_requires_auth,
		meta_transition,
		parent_code,
	} = req.body

	let path = index

	if (index[index.length - 1] === '/') {
		path = index.replace(/.$/, '')
	}

	const name = path.replace('/', '').replaceAll('/', '-')
	const menuItem = {
		parent_code,
		menu_code,
		title,
		index: path,
		icon,
		name,
		meta: {
			title: meta_title,
			requiresAuth: meta_requires_auth,
			transition: meta_transition,
		},
	}
	// if (parent_code) {
	// 	const parent = await Menus.findOne({
	// 		code: parent_code,
	// 	})
	// 	parent.children.push(menuItem)
	// 	parent.save()
	// 	return
	// }

	const result = await Menus.create(menuItem)
	if (result) {
		res.status(200).json({
			success: true,
			message: '添加成功',
			data: menuItem,
		})
		return
	}
	res.status(400).json({
		success: false,
		message: '请稍后再试, 系统错误',
	})
})

/**
 *  @method DELETE
 *  @route /api/menus/:id
 *  @description 删除菜单
 *  @access PRIVATE
 */

const removeMenusRequest = asyncHandler(async (req, res) => {
	const id = req.params.id

	const result = await Menus.findById(id)

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
		id,
	})
})

/**
 *  @method PATCH
 *  @route /api/menus/:id
 *  @description 编辑菜单
 *  @access PRIVATE
 */

const editMenusRequest = asyncHandler(async (req, res) => {
	const id = req.params.id
	const {
		menu_code,
		title,
		index,
		icon,
		meta_title,
		meta_requires_auth,
		meta_transition,
		parent_code,
	} = req.body

	let path = index

	if (index[index.length - 1] === '/') {
		path = index.replace(/.$/, '')
	}

	const name = path.replace('/', '').replaceAll('/', '-')

	const menuItem = {
		menu_code,
		title,
		index: path,
		icon,
		name,
		meta: {
			title: meta_title,
			requiresAuth: meta_requires_auth,
			transition: meta_transition,
		},
		parent_code,
	}

	const result = await Menus.findById(id)
	if (!result) {
		res.status(400).json({
			code: 400,
			message: '未查询到该信息',
		})
		throw new Error('未查询到该信息')
	}
	await result.updateOne(menuItem)
	res.status(200).json({
		success: true,
		message: '修改成功',
		data: menuItem,
	})
})

/**
 *  @method GET
 *  @route /api/menus
 *  @description 获取菜单列表
 *  @access PRIVATE
 */

const getMenusRequest = asyncHandler(async (req, res) => {
	const result = await Menus.find({}).sort({ parent_code: 1 })
	if (!result) {
		res.status(400).json({
			success: false,
			message: '无效的请求',
		})
	}
	let menus = []
	let itemMap = {}
	for (let i = 0; i < result.length; i++) {
		const item = result[i]
		if (!item.parent_code) {
			const menu = {
				...item['_doc'],
				children: [],
			}
			menus.push(menu)
			itemMap[item.menu_code] = i
		} else {
			menus[itemMap[item.parent_code]].children.push(item)
		}
	}
	res.status(200).json({
		success: true,
		data: { list: menus, totalCount: menus.length },
	})
})

module.exports = {
	setMenusRequest,
	removeMenusRequest,
	editMenusRequest,
	getMenusRequest,
}
