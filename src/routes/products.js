const router = require("express").Router();
const { products, getNextId } = require("../data/store");

function validate(body) {
  const errors = [];
  for (const f of ["name", "productId", "category", "unit", "expiryDate"]) {
    if (!body[f] || !String(body[f]).trim()) errors.push(`${f} is required`);
  }
  for (const f of ["price", "quantity", "threshold"]) {
    const n = Number(body[f]);
    if (body[f] === undefined || body[f] === null || body[f] === "" || Number.isNaN(n) || n < 0)
      errors.push(`${f} must be a non-negative number`);
  }
  if (body.expiryDate && Number.isNaN(Date.parse(body.expiryDate))) errors.push("expiryDate must be a valid date");
  return errors;
}

function isDuplicateProductId(productId, exceptId) {
  const key = String(productId).trim().toLowerCase();
  return products.some((p) => p.id !== exceptId && p.productId.toLowerCase() === key);
}

function clean(body) {
  return {
    name: String(body.name).trim(),
    productId: String(body.productId).trim(),
    category: String(body.category).trim(),
    price: Number(body.price),
    quantity: Number(body.quantity),
    unit: String(body.unit).trim(),
    threshold: Number(body.threshold),
    expiryDate: String(body.expiryDate),
  };
}

// GET /api/products?search=abc
router.get("/", (req, res) => {
  const q = String(req.query.search || "").toLowerCase().trim();
  const result = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;
  res.json(result);
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// POST /api/products
router.post("/", (req, res) => {
  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ message: errors.join(", ") });

  if (isDuplicateProductId(req.body.productId)) return res.status(409).json({ message: "Product ID already exists" });

  const product = { id: getNextId(), ...clean(req.body) };
  products.push(product);
  res.status(201).json(product);
});

// PUT /api/products/:id
router.put("/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ message: errors.join(", ") });

  if (isDuplicateProductId(req.body.productId, products[index].id))
    return res.status(409).json({ message: "Product ID already exists" });

  products[index] = { ...products[index], ...clean(req.body) };
  res.json(products[index]);
});

module.exports = router;