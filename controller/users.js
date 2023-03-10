const asyncHandler = require('express-async-handler')
const User = require('../schemas/UserSchemas')

const getUsersRequest = asyncHandler(async (req, res) => {
	const userId = req.user._id
	const result = await User.find({
		_id: {
			$ne: userId,
		},
	})
	res.status(200).json({
		code: 200,
		data: result,
	})
})

module.exports = {
	getUsersRequest,
}
