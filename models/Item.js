const mongoose = require('mongoose');

const { Schema } = mongoose;

const itemSchema = new Schema({
	title    : {
		type     : String,
		required : true
	},
	quantity : {
		type    : Number,
		default : 1
	}
});

itemSchema.set('toJSON', { getters: true });
module.exports = mongoose.model('Item', itemSchema);
