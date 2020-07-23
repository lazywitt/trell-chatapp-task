import React,{useEffect,useState} from 'react';
import Header from './Header'
import {logout} from '../actions/auth'
import { connect } from 'react-redux'
import socketIOClient from "socket.io-client";



const ENDPOINT = process.env.REACT_APP_BASE_URL





const Dashboard = ({dispatch,history,location,email}) => {

    const [socketClient, setSocketClient] = useState(undefined);
    



    useEffect(() => {

        console.log('Socket1')
        const socket = socketIOClient(ENDPOINT);
        setSocketClient(socket)

        socket.on("NewMessage",data=>{
            var message=document.createElement("li");
            var text = 'From:' + data.sender + '  ' + data.msg
            var textnode=document.createTextNode(text);
            message.appendChild(textnode);
            document.getElementById("messages").appendChild(message);
        })

        return () => socket.disconnect();
    
      }, []);



    const logoutHandler = async() => {

        try {
            const res = await dispatch(logout())
            console.log(res)
            history.push('/')
        } catch (error) {
         console.log(error)   
        }
    }

    const onChatFormSubmit = async (e) => {
        e.preventDefault()
        const msg  = document.querySelector('#message').value  

        socketClient.emit('messageToServer',{
            sender:email,
            msg
        })
    }

    return (

        <div>
        <Header logoutHandler={logoutHandler}/>
        <h3>{email}</h3>
        <ul id="messages"></ul>
        <form className="container form" onSubmit={onChatFormSubmit}>
        <input id="message" type="text" placeholder="Message" name="message" />
        <button type="submit" className="button">Send</button>

        </form>
        </div>
    )
}

function mapStateToProps(state) {
    return { email: state.auth.email };
}
  
export default connect(mapStateToProps)(Dashboard)
