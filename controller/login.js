const asyncHandler = require('express-async-handler')

const loginRequest = asyncHandler((req, res) => {
	const { email, password } = req.body
	res.status(200).json({
		message: '成功登陆。。。',
		data: { email, password },
	})
})

module.exports = {
	loginRequest,
}
