import axios from "axios";
import {useEffect, useState, useRef} from "react";
import axiosInstance from "../axiosApi" ;

function UserPage() {

    const [user, setUser] = useState([]);
    const [cart, setCart] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [products, setProducts] = useState([]);
    const isCalledRef =  useRef(false);

    useEffect(()=>{
        console.log("YYY", user);
        if (!isCalledRef.current) {
          isCalledRef.current = true;
          GetUserData();
        }
        console.log("YYY", user);
      //  console.log("products", products);
    },[GetUserData]);


async function Delete(cart_id) {
    const resp = await axiosInstance.delete(`http://127.0.0.1:8000/product/api/cart/delete/${cart_id}`).catch(function (error) {
        console.log("Delete Error catch", error);
    });
}

async function Payment() {
    const resp = await axiosInstance.get('http://127.0.0.1:8000/api/user/payment/').catch(function (error) {
        console.log("Payment Error catch", error);
        setPaymentStatus(`Payment Error ${error.response.data}`)
    });
    if (!paymentStatus.includes("Error"))
    {setPaymentStatus(`Оплата прошла`)}
    isCalledRef.current = false
}

async function GetProductData(item) {
    const newProductValue = await axiosInstance(`http://127.0.0.1:8000/product/api/${item.product}`);
    newProductValue.data.cart_id = item.id;
    newProductValue.data.quantity = item.quantity;
    console.log("GetProductData newProductValue0", newProductValue);
    setProducts(current => [...current, newProductValue.data]);
    console.log("GetProductData newProductValue", newProductValue);
    console.log("GetProductData products", products);
}


async function GetUserData(get_products=false) {
       //event.preventDefault();
       //axiosInstance.defaults.headers[ 'Authorization' ]
       const resp = await axiosInstance.get('http://127.0.0.1:8000/api/user/get/');
       setUser(resp.data);
       console.log("GetUserData", resp.data);
        console.log("GetUserData products.length", products.length);
       if (products.length == 0 || get_products)
       {
           const resp2 = await axiosInstance(`http://127.0.0.1:8000/product/api/cart/${resp.data.id}`);
           setCart(resp2.data);
           console.log("GetUserData 2resp", resp2.data);   // данные о корзине
           setProducts([]);
            for (const item of resp2.data) {
                GetProductData(item)
              }
            console.log("products", products);
    };
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
                </div>
            </div>
        )

}
export default UserPage;