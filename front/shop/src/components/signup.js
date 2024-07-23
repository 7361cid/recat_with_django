import {useEffect, useState, useContext} from "react";
import axios from "axios";
import { UserContext } from "../App";
import { useHistory } from "react-router";

// user/create/
function Signup() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [SignupStatus, setSignupStatus] = useState('');
    const history = useHistory();

    async function SignupSubmit(event) {
       event.preventDefault();

       try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/create/',
            { username, password, email, password2 });
            history.push('/userpage/');

        } catch (error) {
            console.log("SignupSubmit", error);
            setSignupStatus(`Ошибка ${error.response.data.email}
             ${error.response.data.username} ${error.response.data.password}`);
        }
    };

        return (
            < div > Signup
                 <form onSubmit={SignupSubmit}>
                    <label>
                        Username:
                        <input name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </label>
                    <label>
                        Password:
                        <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </label>
                    <label>
                        Password Confirm:
                        <input name="password2" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
                    </label>
                    <label>
                        Email:
                        <input name="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
                <p> {SignupStatus} </p>
            </div>
        )
    }

export default Signup;
