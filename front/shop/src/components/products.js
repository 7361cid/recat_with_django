import axios from "axios";
import {useEffect, useState, useContext} from "react";
import axiosInstance from "../axiosApi" ;
import { UserContext } from "../App";
import { useHistory } from 'react-router-dom';

function Products() {

    const [products, setProducts] = useState([]);
    const [likesList, setLikesList] = useState("");
    const [search, setSearch] = useState("");
    const history = useHistory();
    useEffect(()=>{
        GetProducts();
        console.log("YYY", products);
    },[]);

async function BuyProduct(product_id) {
    console.log("BuyProduct", product_id);
    const product_count = document.getElementById(`input_${product_id}`).value
    const resp = await axiosInstance.post('http://127.0.0.1:8000/product/api/buy',
    {"product_id": product_id, "product_count": product_count});
}

async function LikeProduct(product_id) {
    console.log("BuyProduct", product_id);
    const resp = await axiosInstance.post('http://127.0.0.1:8000/product/api/like',
    {"product_id": product_id});
}

async function DislikeProduct(product_id) {
    console.log("BuyProduct", product_id);
    const resp = await axiosInstance.post('http://127.0.0.1:8000/product/api/dislike',
    {"product_id": product_id});
}

async function FilterByTag(tag) {
    console.log("FilterByTag", tag);
    const resp = await axiosInstance.get(`http://127.0.0.1:8000/product/api?search_tag=${tag}`);
    setProducts(resp.data);
}

async function SearchProduct() {
    const resp = await axiosInstance.get(`http://127.0.0.1:8000/product/api?search=${search}`);
    console.log("SearchProduct", resp.data);
    setProducts(resp.data);
}

async function GetProducts() {
       //event.preventDefault();
       //axiosInstance.defaults.headers[ 'Authorization' ]
       try {
            const resp = await axiosInstance.get('http://127.0.0.1:8000/product/api')
            setProducts(resp.data);
            console.log("ZZZ", resp.data);
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
                    <input id={`input_${product.id}`} type="number" />
                    < button onClick={() => { BuyProduct(product.id) }}>Купить< /button >
                    </td></tr>
                    <tr><td><a href={`/chat/${product.user_seler}`}>Чат с продавцом</a> </td></tr> // передовать owner_id id продавца
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
                    {likesList.includes(product.id) ? < button onClick={() => { DislikeProduct(product.id);GetProducts() }}>Дизлайк< /button >
                    : < button onClick={() => { LikeProduct(product.id);GetProducts() }}>Лайк< /button >}

                  </div>
                );
              })}
                    </section></div>
        )
}

export default Products;