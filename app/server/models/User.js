import mongoose from "mongoose";
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        requred: true,
        unique: true
    },
    password: {
        type: String,
        requred: true,
    },
});

export default mongoose.model('User', UserSchema);