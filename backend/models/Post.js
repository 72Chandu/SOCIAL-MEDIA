const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    caption: String,
    image: {
        public_id:String,
        url: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    comments: [{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        comment: {
            type: String,
            required: true,
        },
    },],

}, { timestamps: true });
module.exports = mongoose.model('Post', PostSchema);