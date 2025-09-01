const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "automation_secret"; // mock

let users = [];
let products = [
  { id: 1, name: "Laptop QA", price: 3000 },
  { id: 2, name: "Headset Automator", price: 500 },
  { id: 3, name: "Keyboard Cypress", price: 250 }
];
let carts = {};

app.post("/api/auth/register", (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, password });
  res.json({ message: "User registered successfully" });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/cart", (req, res) => {
  const { username, productId } = req.body;
  if (!carts[username]) carts[username] = [];
  carts[username].push(products.find(p => p.id === productId));
  res.json(carts[username]);
});

app.get("/api/cart/:username", (req, res) => {
  res.json(carts[req.params.username] || []);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
