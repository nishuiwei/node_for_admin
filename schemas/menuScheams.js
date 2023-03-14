const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MetaSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	requiresAuth: {
		type: Boolean,
		default: true,
	},
	transition: {
		type: String,
		default: 'fade',
	},
})

const MenusSchema = new Schema(
	{
		index: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		icon: {
			type: String,
			default: 'Menus',
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		menu_code: String,
		parent_code: String,
		meta: MetaSchema,
	},
	{
		timestamps: true,
	}
)

const Menus = mongoose.model('Menus', MenusSchema)
module.exports = Menus
