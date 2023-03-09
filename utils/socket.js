const {
	messageStoreMiddleware,
} = require('../middleware/messageStoreMiddleware')

// 初始化连接用户
const connectedUsers = {}

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
	socket.to(connectedUsers[data.userId]).emit('direct-message', { ...identity })

	socket.emit('direct-message', { ...data })
}

module.exports = {
	connectedUsers,
	directMessageHandler,
}
