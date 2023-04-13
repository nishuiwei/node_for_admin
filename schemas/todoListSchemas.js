const mongoose = require('mongoose')
const Schema = mongoose.Schema

const label_type = new Schema({
	title: String,
	type: String,
})

const TodoListSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		is_star: {
			type: Boolean,
		},
		label_type: {
			type: [label_type],
			required: true,
		},
		notes: String,
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt',
		},
	}
)

const TodoList = mongoose.model('TodoList', TodoListSchema)
module.exports = TodoList
