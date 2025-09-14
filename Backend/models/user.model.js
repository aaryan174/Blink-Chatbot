import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    threads:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Threads'
    }]
});


export default mongoose.model('user', userSchema);

