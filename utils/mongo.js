const colors = require('colors')
const mongoose = require('mongoose')
const mongo_url = process.env.MONGO_URL

const configMongoDB = async () => {
	try {
		const conn = await mongoose.connect(mongo_url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		console.log(`MongoDB 已连接：${conn.connection.host}`.cyan.underline)
	} catch (error) {
		console.log(`Error: ${error.message}`.red.underline.bold)
		process.exit(1)
	}
}

module.exports = configMongoDB
