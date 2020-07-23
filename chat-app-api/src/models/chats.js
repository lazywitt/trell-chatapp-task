const mongoose = require('mongoose')


const chatSchema = new mongoose.Schema({
    members:[{
        member:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    }],
    messages:[{
        text:{
            type:String
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    }]
})


const Chat = mongoose.model('Chat',chatSchema)

module.exports = Chat