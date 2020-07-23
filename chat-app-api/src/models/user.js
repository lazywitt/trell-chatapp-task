const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        trim:true
    },

    email:{
        required:true,
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            } 
        }
    },
    password:{
        required:true,
        type:String,
        trim:true,
        validate(value){
            if(value.length < 6){
                throw new Error('Password length too short. Should be greater than 6 char')
            }
            if(validator.equals(value,'password')){
                throw new Error('Password cannot be set to "password"')
            }
        }
    },
    token:{
        type:String
    },
    chats:[{
        chat:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Chat'
        }
    }]
}, {
    timestamps:true
})


// Hash the plain text password before save
userSchema.pre('save',async function (next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }    

    next()

})

// Remove the tasks when user is deleted
userSchema.pre('remove',async function (next){
    const user = this
    await Task.deleteMany({
        owner:user._id
    })
    next()
    

})

userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to find user')
    }

    const isMatched = await bcrypt.compare(password,user.password)
    if(!isMatched){
        throw new Error('Incorrect Password')
    }
    return user
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = await jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET,{
        expiresIn:'7 days'
    })
    user.token = token
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.token

    return userObject
}

const User = mongoose.model('User',userSchema)

module.exports = User