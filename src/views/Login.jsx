import{useState} from 'react'
import axios from "axios"

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({getProducts,setIsAuth}){
const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((predata) => ({
      ...predata,
      [name]: value,
    }))
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      // eslint-disable-next-line react-hooks/immutability
      axios.defaults.headers.common['Authorization'] = token;

      setIsAuth(true);
      getProducts();
    }
    catch (error) {
      console.log(error.response);
      setIsAuth(false)
    }
  }

    return(<div className="container login">
        <form className="form-floating" onSubmit={(e) => onSubmit(e)}>
          <h1>請先登入</h1>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              name="username"
              placeholder="name@example.com"
              value={formData.username}
              onChange={(e) => handleInputChange(e)} />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange(e)} />
            <label htmlFor="Password">Password</label>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2" >登入</button>

        </form>
      </div>

    )
}

export default Login