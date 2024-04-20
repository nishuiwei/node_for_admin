const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const EmailSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		secret: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt',
		},
	}
)

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: EmailSchema,
		password: {
			type: String,
			required: true,
		},
		profilePic: {
			type: String,
			default: '//image.weihuijieonline.com/WechatIMG60.jpeg',
		},
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt',
		},
	}
)

//实现用户密码加密
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next()
	}
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

//实现用户密码是否匹配
UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', UserSchema)
module.exports = User
