import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import * as bootstrap from "bootstrap";
import "./assets/style.css";
import ProductModal from './component/ProductModal';
import Pagination from './component/Pagination';
import Login from './views/Login';



const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};



function App() {
  
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("")
  const [pagination, setPagination] = useState({})
  const productModalRef = useRef(null);

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);

    } catch (err) {
      console.log(err.response
      )
    }

  }


  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    //如果有取得token才把它加到headers上
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false
    })
    const checkLogin = async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/user/check`)
        setIsAuth(true);
        getProducts();
      } catch (error) {
        console.log(error.response)
      }
    };
    checkLogin()
  }, [])

  const openModal = (type, product) => {
    // console.log(product)
    setModalType(type);
    setTemplateProduct((pre) => ({
      ...pre,
      ...product
    }))
    productModalRef.current.show()
  };
  const closeModal = () => {
    productModalRef.current.hide()
  }


  return (
    <>
      {
        !isAuth ? (<Login getProducts={getProducts} setIsAuth={setIsAuth} />) : <div className='container'>
          <div className="mt-2">
            <h2>產品列表</h2>
            <div className="text-end mt-4">
              <button
                type="button"
                className="btn btn-secondary" onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}>
                建立新的產品
              </button>
            </div>
            <div className="my-2">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品種類</th>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">編輯</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    return (<tr key={product.id}>
                      <th scope="row">{product.category}</th>
                      <td>{product.title}</td>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td className={`${product.is_enabled && "text-success"}`}>{product.is_enabled ? "啟用" : "未啟用"}</td>
                      <td><div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => openModal("edited", product)}>編輯</button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => openModal('delet', product)}>刪除</button>
                      </div></td>
                    </tr>)
                  })}
                </tbody>
              </table>
              <Pagination pagination={pagination} onChangePage={getProducts} />
            </div>
          </div>
        </div>

      }

      <ProductModal modalType={modalType}
        templateProduct={templateProduct}
        getProducts={getProducts}
        closeModal={closeModal} />
    </>
  )
}

export default App
