const express = require('express')
const http = require('http')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

// 实例化 express
const app = express()
const PORT = process.env.PORT || 5555

// 创建一个 http 服务器
const server = http.createServer(app)

// 跨域处理
app.use(cors())

// 初始化连接用户
let connectedUsers = {}

const io = require('socket.io')(server, {
	// 设定跨域
	cors: {
		// 地址配置，允许那些网址
		origin: '*',
		// 定义可请求的方法
		methods: ['GET', 'POST'],
	},
})

const TYPE_STTAUS = {
	receiver: 'sender',
	sender: 'receiver',
}

io.on('connection', (socket) => {
	console.log(`socket 客户端已连接${socket.id}`)

	socket.on('disconnect', () => {
		console.log('用户已断开')
	})

	socket.on('conn-init', (data) => {
		socket.join(`user-${data.sender}`)
		console.log(socket.rooms)

		connectedUsers = {
			...connectedUsers,
			[data.sender]: socket.id,
		}
		messageStoreHandler({}, socket, data.sender)
	})

	socket.on('message', (data) => {
		directMessageHandler(data, socket)
	})
})

const userMessageStore = {}

const messageStoreHandler = async (data, socket, userId) => {
	if (!connectedUsers[data.userId] && data.userId !== undefined) {
		if (data.userId) {
			let messageStore = []
			if (userMessageStore[data.userId]) {
				messageStore = [...userMessageStore[data.userId]]
			}
			userMessageStore[data.userId] = [...messageStore, data]
		}
		console.log(userMessageStore)
		return false
	}

	if (userId && userMessageStore[userId]?.length) {
		for (let i = 0; i < userMessageStore[userId].length; i++) {
			const newData = userMessageStore[userId][i]
			console.log(newData)
			console.log(socket.id)
			const identity = {
				...newData,
				type: TYPE_STTAUS[newData.type],
				id: newData.userId,
				userId: newData.id,
			}
			await io
				.to(connectedUsers[userId])
				.emit('direct-message', { ...identity })
		}
		delete userMessageStore[userId]
		return false
	}
}

const directMessageHandler = async (data, socket, userId = null) => {
	await messageStoreHandler(data, socket, userId)
	const identity = {
		...data,
		type: TYPE_STTAUS[data.type],
		id: data.userId,
		userId: data.id,
	}
	socket.to(connectedUsers[data.userId]).emit('direct-message', { ...identity })

	socket.emit('direct-message', { ...data })
}

app.get('/', (req, res) => {
	res.send('work...')
})

// 监听端口号
server.listen(PORT, () => {
	console.log(`服务器正在${PORT}端口运行`)
})
