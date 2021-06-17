const mongoose = require('mongoose');

const { Schema } = mongoose;

const itemSchema = new Schema({
	title      : {
		type     : String,
		required : true
	},
	quantity   : {
		type    : Number,
		default : 1
	},
	type       : {
		type     : String,
		enum     : [
			'fridge',
			'freezer'
		],
		required : true
	},
	expiryDate : {
		type     : String,
		required : true
	}
});

itemSchema.set('toJSON', { getters: true });
module.exports = mongoose.model('Item', itemSchema);
