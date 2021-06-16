const mongoose = require('mongoose');

const { Schema } = mongoose;

const fridgeSchema = new Schema({
	title    : {
		type     : String,
		required : true
	},
	password : {
		type     : String,
		required : true
	},
	items    : [
		{
			type : mongoose.Types.ObjectId,
			ref  : 'Item'
		}
	]
});

fridgeSchema.set('toJSON', { getters: true });
module.exports = mongoose.model('Fridge', fridgeSchema);
