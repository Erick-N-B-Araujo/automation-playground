const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');
const flags = require('./utils/featureFlags');
const app = express();
app.use(cors());
app.use(express.json());
const SECRET = 'automation_secret';
// In-memory stores (MVP)
const users = new Map(); // username -> { username, password, name, email, address }
const sessions = new Map(); // token -> username
const carts = new Map(); // username -> [{id, name, price, qty}]
const orders = new
  Map(); // username -> [{id, items, total, createdAt, address, payment}]
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8')
);
// Helpers
function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token || !sessions.has(token)) return res.status(401).json({
    message:
      'Unauthorized'
  });
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = { username: payload.username };
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
4
function ensureCart(username) {
  if (!carts.has(username)) carts.set(username, []);
  return carts.get(username);
}
// ===================== AUTH =====================
app.post('/api/auth/register', (req, res) => {
  const { username, password, email } = req.body;
  // Bug intencional: validação fraca/errada quando flag ativa
  if (flags.BUG_WEAK_REQUIRED_VALIDATION) {
    if (!username || !password) {
      // deixa passar mesmo faltando email
      users.set(username, { username, password, email: email || '' });
      return res.json({ message: 'Registered (weak validation)' });
    }
  }
  if (!username || !password || !email) {
    return res.status(400).json({
      message: 'username, password and email are required' });
}
if (users.has(username)) return res.status(409).json({
        message: 'User exists' });
users.set(username, {
          username, password, email, name: username, address:
            ''
        });
        return res.json({ message: 'Registered successfully' });
      });
    app.post('/api/auth/login', (req, res) => {
      const { username, password } = req.body;
      const user = users.get(username);
      if (!user || user.password !== password) return res.status(401).json({
        message: 'Invalid credentials'
      });
      const token = jwt.sign({ username }, SECRET, { expiresIn: '2h' });
      sessions.set(token, username);
      return res.json({ token, username });
    });
    app.post('/api/auth/logout', (req, res) => {
      const ua = req.headers['user-agent'] || '';
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      // Bug intencional: logout só funciona em alguns navegadores
      if (flags.BUG_LOGOUT_UA_ONLY) {
        if (!/Chrome|Chromium/i.test(ua)) {
          return res.status(200).json({ message: 'Logout success (maybe?)' });
        }
      }
      sessions.delete(token);
      return res.json({ message: 'Logged out' });
    });
    app.post('/api/auth/recover', (req, res) => {
      const { email } = req.body;
      // Sempre “200 OK”, não revela se email existe
      return res.json({
        message: 'If this email exists, recovery instructions were sent.' });
});
      // ===================== PRODUCTS =====================
      app.get('/api/products', (req, res) => {
        const { q, category, min, max } = req.query;
        let list = [...products];
        if (q) list = list.filter(p =>
          p.name.toLowerCase().includes(String(q).toLowerCase()));
        if (category) list = list.filter(p => p.category === category);
        if (min) list = list.filter(p => p.price >= Number(min));
        if (max) list = list.filter(p => p.price <= Number(max));
        return res.json(list);
      });
      app.get('/api/products/:id', (req, res) => {
        const p = products.find(x => x.id === Number(req.params.id));
        if (!p) return res.status(404).json({ message: 'Not found' });
        return res.json(p);
      });
      // ===================== CART =====================
      app.get('/api/cart', auth, (req, res) => {
        const cart = ensureCart(req.user.username);
        return res.json(cart);
      });
      app.post('/api/cart/add', auth, (req, res) => {
        const { productId, qty = 1 } = req.body;
        const prod = products.find(p => p.id === Number(productId));
        if (!prod) return res.status(404).json({ message: 'Product not found' });
        const cart = ensureCart(req.user.username);
        const existing = cart.find(i => i.id === prod.id);
        if (existing) existing.qty += qty; else cart.push({
          id: prod.id, name:
            prod.name, price: prod.price, qty
        });
        return res.json(cart);
        6
      });
      app.post('/api/cart/remove', auth, (req, res) => {
        const { productId } = req.body;
        const cart = ensureCart(req.user.username);
        // Bug intencional: às vezes o item "some" do carrinho sozinho
        if (flags.BUG_CART_GHOST_REMOVAL && Math.random() < 0.2) {
          // Remove o primeiro item aleatório, ignorando productId
          if (cart.length) cart.splice(0, 1);
          return res.json({ message: 'Removed (ghost)', cart });
        }
        const idx = cart.findIndex(i => i.id === Number(productId));
        if (idx >= 0) cart.splice(idx, 1);
        return res.json({ message: 'Removed', cart });
      });
      // ===================== SHIPPING (frete fake) =====================
      app.post('/api/shipping/calc', (req, res) => {
        const { zipcode, subtotal } = req.body;
        if (!zipcode) return res.status(400).json({ message: 'zipcode required' });
        const base = 19.9;
        const factor = String(zipcode).includes('000') ? 39.9 : 24.9;
        const shipping = subtotal > 3000 ? 0 : base + factor;
        return res.json({ zipcode, shipping });
      });
      // ===================== CHECKOUT =====================
      app.post('/api/checkout', auth, (req, res) => {
        const { address, payment } = req.body;
        const cart = ensureCart(req.user.username);
        if (!cart.length) return res.status(400).json({ message: 'Cart empty' });
        const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
        const order = {
          id: uuid(), items: [...cart], total, createdAt: new
            Date().toISOString(), address, payment
        };
        const userOrders = orders.get(req.user.username) || [];
        userOrders.push(order);
        orders.set(req.user.username, userOrders);
        carts.set(req.user.username, []); // clear cart
        return res.json({ order });
      });
      // ===================== PROFILE / ORDERS =====================
      app.get('/api/me', auth, (req, res) => {
        const u = users.get(req.user.username);
        return res.json({
          username: u.username, email: u.email, name: u.name || '',
          address: u.address || ''
        });
        7
      });
      app.put('/api/me', auth, (req, res) => {
        const u = users.get(req.user.username);
        const { name, email, address } = req.body;
        // Validação simples proposital
        u.name = name ?? u.name;
        u.email = email ?? u.email;
        u.address = address ?? u.address;
        users.set(req.user.username, u);
        return res.json({ message: 'Profile updated', profile: u });
      });
      app.get('/api/orders', auth, (req, res) => {
        return res.json(orders.get(req.user.username) || []);
      });
      // ===================== ADMIN (MVP) =====================
      // Sem auth de role: intencional para praticar testes de segurança
      app.get('/api/admin/products', (req, res) => res.json(products));
      app.post('/api/admin/products', (req, res) => {
        const { name, price, brand, category, desc } = req.body;
        const id = products[products.length - 1].id + 1;
        const p = { id, name, price, brand, category, desc, rating: 0, stock: 0 };
        products.push(p);
        return res.json(p);
      });
      app.put('/api/admin/products/:id', (req, res) => {
        const idx = products.findIndex(p => p.id === Number(req.params.id));
        if (idx < 0) return res.status(404).json({ message: 'Not found' });
        products[idx] = { ...products[idx], ...req.body };
        return res.json(products[idx]);
      });
      app.delete('/api/admin/products/:id', (req, res) => {
        const idx = products.findIndex(p => p.id === Number(req.params.id));
        if (idx < 0) return res.status(404).json({ message: 'Not found' });
        const [removed] = products.splice(idx, 1);
        return res.json(removed);
      });
      // ===================== START =====================
      const PORT = process.env.PORT || 4000;
      app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}
`));