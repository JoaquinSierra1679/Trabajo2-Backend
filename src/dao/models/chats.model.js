import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userName:String,
    message:String,
})

const chatModel = mongoose.model("messages", chatSchema);
export default chatModel;