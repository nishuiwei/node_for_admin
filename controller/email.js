const asyncHandler = require('express-async-handler')
const sendEmail = require('../utils/email.config')
const User = require('../schemas/UserSchemas')

const setEmailRequest = asyncHandler(async (req, res) => {
	const user = req.user
	const { receiver, subject, content } = req.body
	await sendEmail(
		{
			receiver,
			subject,
			content,
			user,
		},
		(err, mail) => {
			if (err) {
				res.status(400).json({
					code: 400,
					message: '发送失败请稍后再试',
					err,
				})
				return false
			}
			if (mail.messageId) {
				res.status(200).json({
					success: true,
					message: '发送成功: 邮箱ID' + mail.messageId,
					messageId: mail.messageId,
				})
			}
		}
	)
})

const setEmailSecretRequest = asyncHandler(async (req, res) => {
	const { email, secret } = req.body
	const user = req.user
	const id = user._id
	const result = await User.findById(id)
	if (!result && email !== user.email) {
		res.status(400).json({
			code: 400,
			message: '为查询到该邮箱，请联系管理员',
		})
		throw new Error('为查询到该邮箱，请联系管理员')
	}

	result.email.secret = secret

	const newUser = await result.save()

	if (!newUser) {
		res.status(400).json({
			code: 400,
			message: '更新失败，请稍后再试',
		})
		throw new Error('更新失败，请稍后再试')
	}

	res.status(200).json({
		message: '更新成功',
		success: true,
	})
})

module.exports = {
	setEmailRequest,
	setEmailSecretRequest,
}
