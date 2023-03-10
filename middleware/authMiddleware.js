const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../schemas/UserSchemas')

const protect = asyncHandler(async (req, res, next) => {
	let token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1]
			const decoded = jwt.verify(token, process.env.JWT_SECRET)
			console.log(decoded)
			req.user = await User.findById(decoded.data).select('-password')
			next()
		} catch (error) {
			res.status(401)
			throw new Error('未授权，token验证失败')
		}
	}
	if (!token) {
		res.status(401)
		throw new Error('未授权，没有token')
	}
})

module.exports = { protect }
