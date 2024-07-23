import axios from "axios";
import {useEffect, useState, useContext} from "react";
import axiosInstance from "../axiosApi" ;
import { useParams } from 'react-router-dom'

function Chat() {

    const [text, setText] = useState('');
    const [chatData, setChatData] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState([]);
    const { owner_id } = useParams()

    useEffect(()=>{
        ChatInit();
    },[]);

async function ChatInit() {
       //event.preventDefault();
        console.log('ChatInit ', owner_id);
        chatUpdate();

    };

async function chatUpdate() {
    try {
            const response = await axiosInstance.get(`http://127.0.0.1:8000/chat/api/get_message?owner_id=${owner_id}`)
            console.log("chatUpdate ZZZ", response);
            for (let item of response.data) {
                console.log("chatUpdate loop ", item);
                console.log("owner_id ", owner_id);
                if (item.user_from == owner_id) {
                    item.className = "chatMessage";
                }
                if (item.user_from != owner_id) {
                    item.className = "chatMessage2";
                }
              }
            setMessages(response.data);
            for (let item of response.data) {
                console.log("chatUpdate loop2 ", item);
                }

        } catch (error) {
            console.log("chatUpdateError", error);
        }
};


async function ChatSubmit(event) {
       event.preventDefault();
       const resp = await axiosInstance.get('http://127.0.0.1:8000/api/user/get/');
       setUser(resp.data);
       console.log("GetUserData", resp.data);
       const response = await axiosInstance.post('http://127.0.0.1:8000/chat/api/message',
       { "text": text, "user_from" : user, "user_to": owner_id});
       console.log("ChatSubmit ZZZ", response);
       await chatUpdate();
    };

        return (
            < div > Chat
                <div id="chatdata">
                {messages.map(function(object, i){
                            return <div>
                                <p className={object.className}> {i} {object.text} className {object.className} iduser_from {object.user_from}</p>
                                </div>
                        })}
                </div>
                <form onSubmit={ChatSubmit}>
                    <label>
                        Введите сообщение:
                        <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
                    </label>
                </form>
            </div>
        )

}
export default Chat;