const mongoose = require('mongoose');


const blog = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required : true,
    },
    converImageUrl: {
        type: String,
        required :false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
    }

})  

const userBlog = mongoose.model('blogPost', blog);

modules.exports = userBlog;