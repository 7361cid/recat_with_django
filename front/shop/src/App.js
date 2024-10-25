import './App.css';

import Login from "./components/login" ;
import Logout from "./components/logout" ;
import Signup from "./components/signup" ;
import Products from "./components/products" ;
import Chat from "./components/chat" ;
import UserPage from "./components/userpage" ;

import { BrowserRouter, Switch, Route, Link } from "react-router-dom" ;
import axios from "axios";
import {useEffect, useState} from "react";

function App() {

   const [products, setProducts] = useState([])
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [user, setUser] = useState({ loggedIn: false, user_id: 0});

  return (
    < BrowserRouter >
    <div className = "site">
                <ul>
                  <li> <Link className={"nav-link"} to={"/userpage/"}>Страница пользователя</Link> </li>
                  <li> <Link className={"nav-link"} to={"/login/"}>Вход</Link> </li>
                  <li> <Link className={"nav-link"} to={"/logout/"}>Выход</Link> </li>
                  <li> <Link className={"nav-link"} to={"/signup/"}>Регистрация</Link> </li>
                  <li> <Link className={"nav-link"} to={"/products/"}>Продукты</Link> </li>
                </ul>
                <Switch>
                        <Route exact path={"/login/"} component={Login}/>
                        <Route exact path={"/logout/"} component={Logout}/>
                        <Route exact path={"/signup/"} component={Signup}/>
                        <Route exact path={"/products/"} component={Products}/>
                        <Route exact path={"/userpage/"} component={UserPage}/>
                        <Route exact path={"/chat/:chat_id"} component={Chat}/>
                        <Route path={"/"} render={() => <div>Home again</div>}/>
                </Switch>
                <main>

                </main>
            </div>
            </ BrowserRouter >
  );
}

export default App;
