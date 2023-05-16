import chatModel from "../models/chats.model.js"

class ChatManager{
    constructor(){

    }
async recieve(data){
    const newMessage = await chatModel.create(data);
    const messages = await this.getMessages();
    return messages
}
async getMessages(){
    const messages = await chatModel.find().lean();
    return messages;
}

}

export default ChatManager;