const colors = require('colors')
const configMongoDB = require('./utils/mongo')
const Menus = require('./schemas/menuSchemas')
const menus = require('./data/menus')

configMongoDB()

//插入样本数据到数据库
const importData = async () => {
	try {
		//清空数据库中的样本数据
		await Menus.deleteMany()
		//实现样本数据插入

		const articlData = await Menus.insertMany(menus)
		console.log('样本数据插入成功！'.green.inverse)
		process.exit()
	} catch (error) {
		console.error(`${error}`.red.inverse)
		process.exit(1)
	}
}

//插入样本数据到数据库
// const destroyData = async () => {
//   try {
//     //清空数据库中的样本数据
//     await Article.deleteMany()
//     // await User.deleteMany()
//     // await Product.deleteMany()

//     console.log('样本数据销毁成功！'.green.inverse)
//     process.exit()
//   } catch (error) {
//     console.error(`${error}`.red.inverse)
//     process.exit(1)
//   }
// }

//判断命令行执行的函数
// if (process.argv[2] === '-d') {
//   destroyData()
// } else {
//   importData()
// }

importData()
