import axios from "axios";
import {useEffect, useState} from "react";
import axiosInstance from "../axiosApi" ;
import { UserContext } from "../App";
import { useHistory } from "react-router";

function Login() {

    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [LoginStatus, setLoginStatus] = useState('');
    let history = useHistory();

async function LoginSubmit(event) {
       event.preventDefault();
       try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/obtain/',
            { username, password });
            setToken(response);
            axiosInstance.defaults.headers[ 'Authorization' ] = "JWT " + response.data.access;
            localStorage.setItem( 'access_token' , response.data.access);
            localStorage.setItem( 'refresh_token' , response.data.refresh);
            history.push('/userpage/');

        } catch (error) {
            console.log("LoginError", error);
            setLoginStatus(`Ошибка ${error.response}`);
        }
    };

        return (
            < div > Login
                 <form onSubmit={LoginSubmit}>
                    <label>
                        Username:
                        <input name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </label>
                    <label>
                        Password:
                        <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
                 <p> {LoginStatus} </p>
            </div>
        )

}
export default Login;
