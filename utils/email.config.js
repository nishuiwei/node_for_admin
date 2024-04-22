const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const colors = require('colors')

//创建一个smtp服务器
const config = {
	host: 'smtp.sina.cn', // 邮箱服务,
	port: 465,
	secure: true,
	secureConnection: false,
	auth: {
		user: 'w920098695@sina.cn', //注册的邮箱账号
		pass: '------', //邮箱的授权码,需开通stmp服务
	},
}
// 创建一个SMTP客户端对象
const transporter = new nodemailer.createTransport(config)

transporter.verify((err, success) => {
	if (err) {
		console.log(err)
	} else {
		console.log('邮箱验证成功'.green.inverse)
	}
})

// const handlebarOptions = {
// 	viewEngine: {
// 		extname: '.handlebars',
// 		partialsDir: '../template/',
// 		defaultLayout: false,
// 	},
// 	viewPath: '../template/',
// }

// transporter.use('compile', hbs(handlebarOptions))

const sendEmail = async (data, callback) => {
	const { subject, user, content, receiver } = data
	const mail = {
		// 发件人信息
		from: `${user.username} <${user.email}>`,
		// 主题
		subject,
		// 收件人
		to: receiver,
		// 邮箱内容
		template: 'email', // the name of the template file i.e email.handlebars
		// context: { content },
		text: content,
	}
	await transporter.sendMail(mail, callback)
}

//发送邮件
module.exports = sendEmail
