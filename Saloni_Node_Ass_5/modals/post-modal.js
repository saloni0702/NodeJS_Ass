const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	user: String
});

const postModal = mongoose.model("post", postSchema);
module.exports = postModal;