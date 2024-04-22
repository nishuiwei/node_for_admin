const Imap = require('node-imap')

// 创建一个 IMAP 连接
const imap = new Imap({
	user: 'w920098695@sina.cn',
	password: '--------',
	host: 'imap.sina.cn',
	port: 993,
	tls: true,
	idle: true, // 启用 IDLE 功能
	keepalive: {
		interval: 60000, // 保持连接的间隔时间（以毫秒为单位）
	},
})

// 事件处理
imap.once('ready', () => {
	console.log('IMAP connection established.')

	// 打开收件箱
	imap.openBox('INBOX', true, (error, mailbox) => {
		if (error) {
			console.log('Failed to open mailbox:', error)
			return
		}

		console.log('Listening for new messages...')

		// 监听新邮件到达事件
		imap.on('mail', (mailId) => {
			console.log(`New mail received - Mail ID: ${mailId}`)

			// 获取新邮件的具体信息
			const messageFetch = imap.fetch(mailId, { bodies: '' })

			messageFetch.on('message', (message) => {
				message.on('body', (stream) => {
					let body = ''
					stream.on('data', (chunk) => {
						body += chunk.toString('utf8')
					})

					stream.once('end', () => {
						console.log('Email body:', body)
					})
				})
			})

			messageFetch.once('error', (error) => {
				console.log('Failed to fetch message:', error)
			})

			messageFetch.once('end', () => {
				console.log('Message fetched.')
			})
		})
	})
})

imap.once('error', (error) => {
	console.log('IMAP error occurred:', error)
})

imap.once('end', () => {
	console.log('IMAP connection closed.')
})

// 连接到服务器
imap.connect()
