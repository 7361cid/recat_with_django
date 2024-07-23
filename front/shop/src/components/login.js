import axios from "axios";
import {useEffect, useState} from "react";
import axiosInstance from "../axiosApi" ;
import { UserContext } from "../App";
import { useHistory } from "react-router";

function Login() {

    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let history = useHistory();

    useEffect(()=>{
        console.log("YYY", token);
    },[]);

async function LoginSubmit(event) {
       event.preventDefault();
       const response = await axios.post('http://127.0.0.1:8000/api/token/obtain/',
        { username, password });
        setToken(response);
        console.log("LoginSubmit ZZZ", response);
        axiosInstance.defaults.headers[ 'Authorization' ] = "JWT " + response.data.access;
        localStorage.setItem( 'access_token' , response.data.access);
        localStorage.setItem( 'refresh_token' , response.data.refresh);
        history.push('/userpage/');
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
            </div>
        )

}
export default Login;