const menus = [
	{
		index: '/main/chat',
		title: 'Chat',
		icon: 'ChatLineRound',
		name: 'main-chat',
		meta: {
			title: '聊天',
			requiresAuth: true,
		},
		menu_code: 'CHAT',
		parent_code: '',
	},
	{
		index: '/main/settings',
		title: '系统设置',
		icon: 'Setting',
		name: 'main-setting',
		meta: {
			title: '系统设置',
			requiresAuth: true,
		},
		menu_code: 'SETTINGS',
		parent_code: '',
	},
	{
		index: '/main/settings/menus',
		title: '菜单管理',
		icon: 'Menu',
		name: 'main-setting-menu',
		meta: {
			title: '菜单管理 - 系统设置',
			requiresAuth: true,
		},
		menu_code: 'SETTINGS_MENUS',
		parent_code: 'SETTINGS',
	},
]

module.exports = menus
