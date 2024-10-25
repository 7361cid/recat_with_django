import {useEffect, useState, useContext} from "react";
import axios from "axios";
import { UserContext } from "../App";
import { useHistory } from "react-router";

function Signup() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [SignupStatus, setSignupStatus] = useState('');
    const history = useHistory();

    function formatErrorMessage(response) {  // форматирование сообщения об ошибке
        let message = '';
        if (response.data.email) {
            message = message + `Ошибка в email ${response.data.email}`
        }
        if (response.data.password) {
            message = message + `Ошибка в пароле ${response.data.password}`
        }
        if (response.data.username) {
            message = message + `Ошибка в имени пользователя ${response.data.username}`
        }
        return message;
    }

    async function SignupSubmit(event) {
       event.preventDefault();

       try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/create/',
            { username, password, email, password2 });
            history.push('/userpage/');

        } catch (error) {
            console.log("SignupSubmit", error);
            let error_message = formatErrorMessage(error.response);
            setSignupStatus(`${error_message}`);
        }
    };

        return (
            < div > Signup
                 <form onSubmit={SignupSubmit}>
                    <div>
                        Username:
                        <input name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <label>
                        Password:
                        <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </label>
                    <label>
                        Password Confirm:
                        <input name="password2" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
                    </label>
                    <div>
                        Email:
                        <input name="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <input type="submit" value="Submit"/>
                </form>
                <p> {SignupStatus} </p>
            </div>
        )
    }

export default Signup;
