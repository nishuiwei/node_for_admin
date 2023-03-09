const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken')

const loginRequest = asyncHandler((req, res) => {
	const { email, password } = req.body
	res.status(200).json({
		message: '成功登陆。。。',
		success: true,
		data: { email, password, token: generateToken(email) },
	})
})

module.exports = {
	loginRequest,
}
