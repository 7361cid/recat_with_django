import axios from "axios";
import {useEffect, useState, useContext} from "react";
import axiosInstance from "../axiosApi" ;
import { useHistory } from "react-router";

function Logout() {

    const [token, setToken] = useState('');
    let history = useHistory();

    useEffect(()=>{
        LogoutFunc();
    },[]);

async function LogoutFunc() {
       //event.preventDefault();
        axiosInstance.defaults.headers[ 'Authorization' ] = ""
        localStorage.setItem( 'access_token' , "");
        localStorage.setItem( 'refresh_token' , "");
        history.push('/');
    };

        return (
            < div > Logout

            </div>
        )

}
export default Logout;