const express = require('express')
const cors = require('cors')
const socketio = require('socket.io')
require('./db/mongoose.js')
const userRouter = require('./routers/user')




const app = express()




const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.json())

app.use(userRouter)



const port = process.env.PORT || 3001

const expressServer = app.listen(port,()=>{
    console.log("Listening on port ",port)
})

const io = socketio(expressServer);


io.on('connection',(socket)=>{


    console.log('New Member Connected!')

    socket.on('reconnect',()=>{
        console.log(' Reconnected')
    })

    socket.on('messageToServer',(data)=>{
        console.log(data)
        io.emit('NewMessage',data)
    })

    socket.on('disconnect',()=>{
        console.log(' Disconnected')

    })
})
