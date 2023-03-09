const express = require('express')
const http = require('http')
const cors = require('cors')
const {
	directMessageHandler,
	connInitHandler,
	messageStoreMiddleware,
} = require('./utils/socket')
require('dotenv').config()

// 实例化 express
const app = express()
const PORT = process.env.PORT || 5555

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

// 监听端口号
server.listen(PORT, () => {
	console.log(`服务器正在${PORT}端口运行`)
})
