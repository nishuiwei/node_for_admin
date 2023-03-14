const asyncHandler = require('express-async-handler')
const Menus = require('../schemas/menuScheams')

// const nest = (code, arr) => {
// 	return arr
// 		.filter((item) => item.parent_code === code)
// 		.map((item) => ({ ...item, children: nest(item.parent_code, arr) }))
// }

const getMenusRequest = asyncHandler(async (req, res) => {
	// const type = req.query.type
	const result = await Menus.find({})

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
			menus.push({ ...item['_doc'], children: [] })
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
	getMenusRequest,
}
