import axios from "axios";
import {useEffect, useState, useContext} from "react";
import axiosInstance from "../axiosApi" ;
import { UserContext } from "../App";

function Products() {

    const [products, setProducts] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const [likesList, setLikesList] = useState("");
    const [search, setSearch] = useState("");
    console.log("FROM Products value of user", user);
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
       const resp = await axiosInstance.get('http://127.0.0.1:8000/product/api');
       setProducts(resp.data);
       console.log("ZZZ", resp.data);
       const likes_resp = await axiosInstance.get('http://127.0.0.1:8000/product/api/likes_list');
       setLikesList(likes_resp.data);
    };

        return (
            < div > Products
            <div>
                Поиск <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>
                <input type="submit" value="GO" class="submit-btn" onClick={() => { SearchProduct();}} />
            </div>
        {products.map((product, index) => {
                return (
                  <div key={index}>
                    <h2>name: {product.name}</h2>
                    <h2>price: {product.price}</h2>
                    <h2>likes: {product.likes}</h2>
                    <h2>tags: {product.tags}</h2>
                    <tbody>
                        {product.tags.map(function(object, i){
                            return <div>
                            < button onClick={() => { FilterByTag(product.tags[i]) }}>{product.tags[i]}< /button >
                            </div>
                        })}
                    </tbody>
                    <img src={`http://localhost:8000${product.image_url}`} width="200" height="200"></img>
                    <hr />
                    <input id={`input_${product.id}`} type="number" />
                    < button onClick={() => { BuyProduct(product.id) }}>Купить< /button >
                    {likesList.includes(product.id) ? < button onClick={() => { DislikeProduct(product.id);GetProducts() }}>Дизлайк< /button >
                    : < button onClick={() => { LikeProduct(product.id);GetProducts() }}>Лайк< /button >}

                  </div>
                );
              })}
                    </div>
        )

}

export default Products;