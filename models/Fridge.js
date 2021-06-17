const mongoose = require('mongoose');

const { Schema } = mongoose;

const fridgeSchema = new Schema({
	title      : {
		type     : String,
		required : true
	},
	password   : {
		type     : String,
		required : true
	},
	items      : [
		{
			type : mongoose.Types.ObjectId,
			ref  : 'Item'
		}
	],
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

fridgeSchema.set('toJSON', { getters: true });
module.exports = mongoose.model('Fridge', fridgeSchema);
