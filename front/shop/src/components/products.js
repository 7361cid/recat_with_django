import axios from "axios";
import {useEffect, useState, useContext} from "react";
import axiosInstance from "../axiosApi" ;
import { UserContext } from "../App";
import { useHistory } from 'react-router-dom';

function Products() {

    const [products, setProducts] = useState([]);
    const [likesList, setLikesList] = useState("");
    const [search, setSearch] = useState("");
    const [ChatId, setChatId] = useState("");
    const history = useHistory();
    useEffect(()=>{
        GetProducts();
        console.log("PRODUCTS", products);
    },[]);

async function GetChatId(owner_id) {
    const resp = await axiosInstance.get(`http://127.0.0.1:8000/chat/api/get_chat_id?owner_id=${owner_id}`)
    console.log(" GetChatId ", resp.data.chat_id);
    return resp.data.chat_id;
}

function SyncGetChatId(owner_id) {
        GetChatId(owner_id).then(result => {
             console.log(" SyncGEtChatId ", result);
             setChatId(result);
        }).catch(err => {
            console.log(" SyncGEtChatId ", err);
    });

}
async function BuyProduct(product_id) {
    const product_count = document.getElementById(`input_${product_id}`).value
    const resp = await axiosInstance.post('http://127.0.0.1:8000/product/api/buy',
    {"product_id": product_id, "product_count": product_count});
}

async function LikeProduct(product_id) {
    const resp = await axiosInstance.post('http://127.0.0.1:8000/product/api/like',
    {"product_id": product_id});
}

async function FilterByTag(tag) {
    const resp = await axiosInstance.get(`http://127.0.0.1:8000/product/api?search_tag=${tag}`);
    setProducts(resp.data);
}

async function SearchProduct() {
    const resp = await axiosInstance.get(`http://127.0.0.1:8000/product/api?search=${search}`);
    setProducts(resp.data);
}

async function GetProducts() {
       try {
            const resp = await axiosInstance.get('http://127.0.0.1:8000/product/api')
            setProducts(resp.data);
            const likes_resp = await axiosInstance.get('http://127.0.0.1:8000/product/api/likes_list');
            setLikesList(likes_resp.data);

        } catch (error) {
            console.log("GetProductsError", error);
            history.replace('/login')
        }
    };

        return (
            < div >
            <div>
                Поиск <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>
                <input type="submit" value="GO" class="submit-btn" onClick={() => { SearchProduct();}} />
            </div>
         <section class="product_section">
        {products.map((product, index) => {
                return (
                  <div key={index}>
                    <table>
                    <tr><td rowspan="4"><img src={`http://localhost:8000${product.image_url}`} width="200" height="200"></img>
                    </td><td>{product.name}</td></tr>
                    <tr><td>{product.price}$
                    <input id={`input_${product.id}`} defaultValue="1" type="number" />
                    < button onClick={() => { BuyProduct(product.id) }}>Купить< /button >
                    </td></tr>
                    <tr><td>
                    {SyncGetChatId(product.user_seler)}
                    <a href={`/chat/${ChatId}`}>Чат с продавцом</a>
                    </td></tr>
                    <tr><td>{product.likes}</td></tr>
                    <tr><td>
                    Теги
                    {product.tags.map(function(object, i){
                            return <div>
                            < button onClick={() => { FilterByTag(product.tags[i]) }}>{product.tags[i]}< /button >
                            </div>
                        })}
                    </td></tr>
                    </table>
                    < button onClick={() => { LikeProduct(product.id);GetProducts() }}>Лайк< /button >

                  </div>
                );
              })}
                    </section></div>
        )
}

export default Products;