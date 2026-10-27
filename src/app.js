const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const requireAuth = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", requireAuth, productRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Malformed JSON bodies and other unexpected errors
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON body" });
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
