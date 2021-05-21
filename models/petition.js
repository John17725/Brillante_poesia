const { Schema, model } = require('mongoose');

const Petition = new Schema({
	name: {type: String},
	tel: {type: Number},
	description: {type: String},
	status: {type:Boolean, default: false},
	filename: {type: String, default: ''},
	path: {type: String, default: ''},
	mimetype: {type: String},
	size: {type: Number},
	created_at: {type: Date, default: Date.now()}
});

module.exports = model('Petition', Petition)