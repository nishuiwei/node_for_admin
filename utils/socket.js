// 初始化连接用户
let connectedUsers = {}
const userMessageStore = {}

const TYPE_STTAUS = {
	receiver: 'sender',
	sender: 'receiver',
}

const directMessageHandler = async (data, socket, userId = null, io) => {
	await messageStoreMiddleware(data, null, userId)
	const identity = {
		...data,
		type: TYPE_STTAUS[data.type],
		id: data.userId,
		userId: data.id,
	}
	console.log(connectedUsers)
	socket.to(connectedUsers[data.userId]).emit('direct-message', { ...identity })

	socket.emit('direct-message', { ...data })
}

const connInitHandler = (data, socket) => {
	connectedUsers = {
		...connectedUsers,
		[data.sender]: socket.id,
	}
}

const messageStoreMiddleware = async (data, socket, userId) => {
	if (!connectedUsers[data.userId] && data.userId !== undefined) {
		if (data.userId) {
			let messageStore = []
			if (userMessageStore[data.userId]) {
				messageStore = [...userMessageStore[data.userId]]
			}
			userMessageStore[data.userId] = [...messageStore, data]
		}
		return false
	}
	if (userId && userMessageStore[userId]?.length) {
		for (let i = 0; i < userMessageStore[userId].length; i++) {
			const newData = userMessageStore[userId][i]
			const identity = {
				...newData,
				type: TYPE_STTAUS[newData.type],
				id: newData.userId,
				userId: newData.id,
			}
			await socket
				.to(connectedUsers[userId])
				.emit('direct-message', { ...identity })
		}
		delete userMessageStore[userId]
		return false
	}
}

module.exports = {
	messageStoreMiddleware,
	directMessageHandler,
	connInitHandler,
}
