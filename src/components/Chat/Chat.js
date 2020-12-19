import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { useHistory } from "react-router-dom";

import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;



const Chat = ({location}) => {
    const history = useHistory();
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [users, setUsers] = useState('')
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    // const ENDPOINT = 'https://chatapp-server-soumyab.herokuapp.com/';
    const ENDPOINT = 'localhost:3030';

    useEffect(() => {
        const {name, room} = queryString.parse(location.search);

        socket =io(ENDPOINT,{transports: ['websocket']});

        setName(name);
        setRoom(room);

        socket.emit('join', {name, room},  (error) => {
            if(error){
                console.log('User already exists!');
                history.push({
                    pathname: '/',
                    state: { invalidUser: true }
                  });
            }            
        });

        // return () => {
        //     socket.emit('disconnectChat');
        //     socket.off();
        // }

    },[ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })

        socket.on('roomData', ({users}) => setUsers(users));
    },[messages]);

    //function for sending messages    
    const sendMessage = (event) => {
        event.preventDefault();

        if(message){
            socket.emit('sendMessage', message, () => {
                setMessage('');
            });
        }
    }

    console.log(message, messages);

    return (        
            <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users} />
        </div>
    )
}

export default Chat;