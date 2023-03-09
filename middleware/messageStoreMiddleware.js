const userMessageStore = {}

const TYPE_STTAUS = {
	receiver: 'sender',
	sender: 'receiver',
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
		console.log(userMessageStore)
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
}
