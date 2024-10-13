import axios from "axios";
import {useEffect, useState, useRef} from "react";
import axiosInstance from "../axiosApi" ;
import { useHistory } from 'react-router-dom';

function UserPage() {

    const [user, setUser] = useState([]);
    const [cart, setCart] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [promocod, setPromocod] = useState("");
    const [promocodStatus, setPromocodStatus] = useState("");
    const [products, setProducts] = useState([]);
    const isCalledRef =  useRef(false);
    const history = useHistory();

    useEffect(()=>{
        if (!isCalledRef.current) {
          isCalledRef.current = true;
          GetUserData();
        }
    },[GetUserData]);


async function Delete(cart_id) {
    const resp = await axiosInstance.delete(`http://127.0.0.1:8000/product/api/cart/delete/${cart_id}`).catch(function (error) {
        console.log("Delete Error catch", error);
    });
}

async function Payment() {
    const resp = await axiosInstance.get(`http://127.0.0.1:8000/api/user/payment/?promocod=${promocod}`).catch(function (error) {
        console.log("Payment Error catch", error);
        setPaymentStatus(`Payment Error ${error.response.data}`)
    });
    if (!paymentStatus.includes("Error"))
    {setPaymentStatus(`Оплата прошла`)}
    isCalledRef.current = false
}

async function CheckPromocod(cod) {
    setPromocod(cod);
    const resp = await axiosInstance.post(`http://127.0.0.1:8000/product/api/promocod_check`,
    {"promocod": cod})
    setPromocodStatus(`CheckPromocod ${resp.data}`);
}

async function GetProductData(item) {
    const newProductValue = await axiosInstance(`http://127.0.0.1:8000/product/api/${item.product}`);
    newProductValue.data.cart_id = item.id;
    newProductValue.data.quantity = item.quantity;
    setProducts(current => [...current, newProductValue.data]);
}


async function GetUserData(get_products=false) {
       //event.preventDefault();
       //axiosInstance.defaults.headers[ 'Authorization' ]

       try {
            const resp = await axiosInstance.get('http://127.0.0.1:8000/api/user/get/');
       setUser(resp.data);
       if (products.length == 0 || get_products)
       {
           const resp2 = await axiosInstance(`http://127.0.0.1:8000/product/api/cart/${resp.data.id}`);
           setCart(resp2.data);
           setProducts([]);
            for (const item of resp2.data) {
                GetProductData(item)
              }
        };

        } catch (error) {
            console.log("GetUserDataError", error);
            history.replace('/login')
        }
}

        return (
            <div>
                <p>Вы зашли на свою страницу!</p>
                <p>Имя: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Баланс: {user.money}</p>
                <div>
                    <p>Ваша корзина  продуктов {products.length}</p>
                    < div >
                    {products.map((product, index) => {
                            return (
                              <div key={index}>
                                <h2>name: {product.name}</h2>
                                <h2>price: {product.price}</h2>
                                <h2>quantity: {product.quantity}</h2>
                                < button onClick={() => { Delete(product.cart_id); GetUserData(true); }}> Удалить из Корзины < /button >
                                <hr />
                              </div>
                            );
                          })}
                    </div>
                    < button onClick={() => { Payment(); GetUserData(true); }}> Оформить покупку < /button >
                    <p>{paymentStatus}</p>
                    Ввести промокод <input type="text" value={promocod} onChange={(e) => CheckPromocod(e.target.value)}/>
                    <p>{promocodStatus}</p>
                </div>
            </div>
        )
}
export default UserPage;