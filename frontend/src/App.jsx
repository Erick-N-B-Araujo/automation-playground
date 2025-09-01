import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Recover from './pages/Recover';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import { http, setToken } from './api';
export default function App() {
  const loc = useLocation();
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [q, setQ] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token) { setToken(token); setUser({ username }); }
    14
  }, []);
  const handleLogout = async () => {
    try { await http.post('/auth/logout'); } catch { }
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
  };
  const onSearch = (term) => {
    const url = new URL(window.location.href);
    url.searchParams.set('q', term);
    window.history.pushState({}, '', url.toString());
    setQ(term);
  };
  const searchParams = useMemo(() => new URLSearchParams(loc.search),
    [loc.search]);
  return (
    <>
      <Header onSearch={onSearch} user={user} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home searchParams={searchParams}
            onAdd={(id) => http.post('/cart/add', { productId: id }).then(() => nav('/cart'))} />} /
          >
          <Route path="/product/:id" element={<ProductDetail
            onAdd={(id) => http.post('/cart/add', { productId: id }).then(() => nav('/cart'))} />} /
          >
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login onLogin={(u) => setUser(u)} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recover" element={<Recover />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </>
  );
}