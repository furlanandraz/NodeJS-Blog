import mongoose from "mongoose";
const Schema = mongoose.Schema;
const PostSchema = new Schema({
    title: {
        type: String,
        requred: true
    },
    body: {
        type: String,
        requred: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Post', PostSchema);