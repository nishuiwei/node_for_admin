const asyncHandler = require('express-async-handler')
const User = require('../schemas/UserSchemas')
const generateToken = require('../utils/generateToken')

const loginRequest = asyncHandler(async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({
		email,
	})
	if (!user) {
		res.status(400).json({
			code: 400,
			message: '邮箱未被注册',
		})
		throw new Error('邮箱未被注册')
	}

	if (user && (await user.matchPassword(password))) {
		res.json({
			code: 200,
			data: {
				id: user._id,
				token: generateToken(user._id),
			},
		})
	} else {
		res.status(401)
		throw new Error('邮箱或者密码无效')
	}
})

const registerRequest = asyncHandler(async (req, res) => {
	const { email, password, username } = req.body
	console.log('123')
	const result = await User.findOne({ email })
	if (result) {
		res.status(400).json({
			code: 400,
			message: '邮箱已被注册',
			data: {},
		})
	}
	if (!result) {
		const data = {
			email,
			password,
			username,
		}
		const result = await User.create(data)
		if (!result) {
			res.status(400).json({
				code: 400,
				message: '无效的用户信息',
				data: {},
			})
			return
		}
		res.status(200).json({
			code: 200,
			data: {
				id: result._id,
				username: result.username,
				email: result.email,
				profilePic: result.profilePic,
			},
		})
	}
})

module.exports = {
	loginRequest,
	registerRequest,
}
