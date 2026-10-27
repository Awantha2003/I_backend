const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { users } = require("../data/store");

let nextUserId = 1;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !String(name).trim()) return res.status(400).json({ message: "Name is required" });
  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ message: "A valid email is required" });
  if (!password || String(password).length < 8)
    return res.status(400).json({ message: "Password must be at least 8 characters" });

  const normalizedEmail = String(email).toLowerCase();
  if (users.find((u) => u.email === normalizedEmail))
    return res.status(409).json({ message: "Email is already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: nextUserId++, name: String(name).trim(), email: normalizedEmail, passwordHash };
  users.push(user);

  res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const user = users.find((u) => u.email === String(email).toLowerCase());
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

module.exports = router;