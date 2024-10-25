import axios from "axios";
import {useEffect, useState, useContext} from "react";
import axiosInstance from "../axiosApi" ;
import { useParams } from 'react-router-dom'

function Chat() {

    const [newMessageText, setNewMessageText] = useState('');
    const [chatData, setChatData] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState([]);
    const { chat_id } = useParams();   // параметр из ссылки

    useEffect(()=>{
        ChatInit();
    },[]);

async function ChatInit() {
        chatUpdate();
    };

async function chatUpdate() {   // Получение данных чата
    try {
            const response = await axiosInstance.get(`http://127.0.0.1:8000/chat/api/message?chat_id=${chat_id}`)
            console.log("chatUpdate", response);
            const owner_id = response.data.owner_id;
            for (let item of response.data.messages) {
                console.log("chatUpdate2", item.message_owner_id, owner_id);
                if (item.message_owner_id == owner_id) {  // Разделение чата на две колонки для принятых и отправленных сообщений
                    item.className = "chatMessage";
                }
                else  {
                    item.className = "chatMessage2";
                }
              }
            setMessages(response.data.messages);

        } catch (error) {
            console.log("chatUpdateError", error);
        }
};


async function ChatSubmit(event) {
       event.preventDefault();   // Создание нового сообщения
       try {
            const resp = await axiosInstance.get('http://127.0.0.1:8000/api/user/get/');
            setUser(resp.data);
            const response = await axiosInstance.post('http://127.0.0.1:8000/chat/api/message',
            { "text": newMessageText, "user_from" : user, "chat_id": chat_id});
            console.log("chatSubmit", response);
            await chatUpdate();
        } catch (error) {
            console.log("Message Create Error", error);
        }

    };

        return (
            < div > Chat
                <div id="chatdata">
                {messages.map(function(object, i){          // Вывод старых сообщений
                            return <div>
                                <p className={object.className}> {object.text} </p>
                                </div>
                        })}
                </div>
                <form onSubmit={ChatSubmit}>
                    <label>
                        Введите сообщение:
                        <input type="text" value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)}/>
                    </label>
                </form>
            </div>
        )

}
export default Chat;