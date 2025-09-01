import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:4000/api";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const login = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, { username, password });
      setToken(res.data.token);
    } catch {
      alert("Invalid credentials");
    }
  };

  const register = async () => {
    try {
      await axios.post(`${API}/auth/register`, { username, password });
      alert("Registered successfully");
    } catch {
      alert("User already exists");
    }
  };

  const loadProducts = async () => {
    const res = await axios.get(`${API}/products`);
    setProducts(res.data);
  };

  const addToCart = async (id) => {
    const res = await axios.post(`${API}/cart`, { username, productId: id });
    setCart(res.data);
  };

  const loadCart = async () => {
    const res = await axios.get(`${API}/cart/${username}`);
    setCart(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      {!token ? (
        <div>
          <h2>Login/Register</h2>
          <input placeholder="User" value={username} onChange={e => setUsername(e.target.value)} />
          <input placeholder="Pass" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
          <button onClick={register}>Register</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {username}</h2>
          <h3>Products</h3>
          <ul>
            {products.map(p => (
              <li key={p.id}>
                {p.name} - ${p.price}
                <button onClick={() => addToCart(p.id)}>Add</button>
              </li>
            ))}
          </ul>
          <h3>Your Cart</h3>
          <button onClick={loadCart}>Refresh</button>
          <ul>
            {cart.map((c, i) => <li key={i}>{c.name}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
