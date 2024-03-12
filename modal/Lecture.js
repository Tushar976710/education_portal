const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
        // default: "dummy2.jpg"
    }
}, { timestamps: true })


module.exports = mongoose.model("product", productSchema)