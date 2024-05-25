import './App.css';

import Login from "./components/login" ;
import Signup from "./components/signup" ;
import Products from "./components/products" ;
import UserPage from "./components/userpage" ;

import { BrowserRouter, Switch, Route, Link } from "react-router-dom" ;
import axios from "axios";
import {useEffect, useState, createContext} from "react";

export const UserContext = createContext();

function App() {

   const [products, setProducts] = useState([])
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [user, setUser] = useState({ loggedIn: false, user_id: 0});

  return (
    <UserContext.Provider value={{ user, setUser }}>
    < BrowserRouter >
    <div className = "site">
                <ul>
                  <li> <Link className={"nav-link"} to={"/userpage/"}>Home</Link> </li>
                  <li> <Link className={"nav-link"} to={"/login/"}>Login</Link> </li>
                  <li> <Link className={"nav-link"} to={"/signup/"}>Signup</Link> </li>
                  <li> <Link className={"nav-link"} to={"/products/"}>Products</Link> </li>
                </ul>
                <Switch>
                        <Route exact path={"/login/"} component={Login}/>
                        <Route exact path={"/signup/"} component={Signup}/>
                        <Route exact path={"/products/"} component={Products}/>
                        <Route exact path={"/userpage/"} component={UserPage}/>
                        <Route path={"/"} render={() => <div>Home again</div>}/>
                </Switch>
                <main>
                    <h1>Ahhh after 10,000 years I'm free. Time to conquer the Earth!</h1>
                </main>
            </div>
            </ BrowserRouter >
            </UserContext.Provider>
  );
}

export default App;
