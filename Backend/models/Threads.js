
import mongoose from "mongoose";


// this is message Schema 
const MessageSchema = new mongoose.Schema({
    Role: {
        type: String,
        enum: ['user', 'model'],
        required: true
    },
    Content: {
        type: String,
        required: true,
    },
    Timestamp:{
        type: Date,
        default: Date.now
    }
});
// and this is thread Schema
const ThreadSchema = new mongoose.Schema({
    ThreadId: {
        type: String,
        required: true,
        unique: true    
    },
    Title: {
        type: String,
        default: "New Chat"
    },
    Message: [MessageSchema],
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    UpdatedAtTime:{
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Threads", ThreadSchema);