const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Chat = require('../models/chats')



const router = new express.Router()

// Create a new user
router.post('/users',async (req,res)=>{
    console.log('New Signup Request')
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error)
    } 
})

// Login
router.post('/users/login',async (req,res)=>{
    console.log('New Login Request:' + Date.now())
    console.log(req.body)
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()

        res.send({user,token})

    } catch (error) {
        res.status(400).send(error)
        
    }
})

// Logout of all sessions
router.post('/users/logout',auth, async (req,res)=>{
    try {
        req.user.token = undefined
        await req.user.save()
        res.send()

    } catch (error) {
        res.status(500).send()
        
    }
})

// Create a new chat
router.post('/chat',auth, async (req,res)=>{



    try {
        console.log(req.body)
        const user = req.user
        const member2Email = req.body.member2
        const user2 = await User.findOne({email:req.body.member2})
        if(!user2){
            throw new Error('User not found')
        }
        const chat = await Chat.findOne({members:[user._id,user2._id]})
        if(chat){
            console.log('Chat found!')
            return res.send(chat)
        }
        console.log('New Chat')
        console.log(user2.name)
        
        const newchat = new Chat({
            members:[user._id,user2._id]
        })
        await newchat.save()
        user.chats = user.chats.concat({chat:newchat._id})
        await user.save()
        user2.chats = user2.chats.concat({chat:newchat._id})
        await user2.save()

        res.send(newchat)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.get('/chat/:id',auth,(req,res)=>{




})

module.exports = router
