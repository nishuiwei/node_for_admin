const express = require('express')
const http = require('http')
const cors = require('cors')
const {
	directMessageHandler,
	connInitHandler,
	messageStoreMiddleware,
} = require('./utils/socket')
require('dotenv').config()
const bodyParser = require('body-parser')
const fs = require('fs')
const configMongoDB = require('./utils/mongo')

configMongoDB()
// 实例化 express
const app = express()
const PORT = process.env.PORT || 5555
// 去除指纹
app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// 创建一个 http 服务器
const server = http.createServer(app)

// 跨域处理
app.use(cors())

const io = require('socket.io')(server, {
	// 设定跨域
	cors: {
		// 地址配置，允许那些网址
		origin: '*',
		// 定义可请求的方法
		methods: ['GET', 'POST'],
	},
})

io.on('connection', (socket) => {
	console.log(`socket 客户端已连接${socket.id}`)

	socket.on('disconnect', () => {
		console.log('用户已断开')
	})

	socket.on('conn-init', (data) => {
		connInitHandler(data, socket)
		messageStoreMiddleware({}, io, data.sender)
	})

	socket.on('message', (data) => {
		directMessageHandler(data, socket)
	})
})

app.get('/', (req, res) => {
	res.send('work...')
})

// fs.readFileSync('./router/**.js', (err, data) => {
// 	if (err) return err
// 	console.log(data)
// })

fs.readdir('./router', (err, data) => {
	if (err) return err
	if (data.length !== 0) {
		const routers = data
		for (let i = 0; i < routers.length; i++) {
			const routerFile = routers[i]
			const router = routerFile.split('.')[0]
			const path = `${__dirname}/router/${routerFile}`
			console.log(`/api/${router}`)
			app.use(`/api/${router}`, require(path))
		}
	}
})

// 监听端口号
server.listen(PORT, () => {
	console.log(`服务器正在${PORT}端口运行`)
})
