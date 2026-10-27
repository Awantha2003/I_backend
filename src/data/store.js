const users = [];

const products = [
  { id: 1, productId: "PRD-001", name: "Maggi", category: "Food", price: 430, quantity: 43, unit: "Packets", threshold: 12, expiryDate: "2026-12-11" },
  { id: 2, productId: "PRD-002", name: "Bru", category: "Beverages", price: 257, quantity: 0, unit: "Packets", threshold: 12, expiryDate: "2026-12-21" },
  { id: 3, productId: "PRD-003", name: "Red Bull", category: "Beverages", price: 405, quantity: 36, unit: "Packets", threshold: 9, expiryDate: "2026-12-05" },
  { id: 4, productId: "PRD-004", name: "Bourn Vita", category: "Beverages", price: 502, quantity: 0, unit: "Packets", threshold: 6, expiryDate: "2026-12-08" },
  { id: 5, productId: "PRD-005", name: "Horlicks", category: "Beverages", price: 530, quantity: 5, unit: "Packets", threshold: 5, expiryDate: "2027-01-09" },
  { id: 6, productId: "PRD-006", name: "Harpic", category: "Household", price: 605, quantity: 10, unit: "Packets", threshold: 5, expiryDate: "2027-01-09" },
  { id: 7, productId: "PRD-007", name: "Ariel", category: "Household", price: 408, quantity: 0, unit: "Packets", threshold: 7, expiryDate: "2027-12-15" },
  { id: 8, productId: "PRD-008", name: "Scotch Brite", category: "Household", price: 359, quantity: 43, unit: "Packets", threshold: 8, expiryDate: "2027-06-06" },
  { id: 9, productId: "PRD-009", name: "Coca cola", category: "Beverages", price: 205, quantity: 8, unit: "Packets", threshold: 10, expiryDate: "2026-11-11" },
  { id: 10, productId: "PRD-010", name: "Sunsilk", category: "Personal Care", price: 320, quantity: 25, unit: "Packets", threshold: 10, expiryDate: "2027-04-20" },
  { id: 11, productId: "PRD-011", name: "Dettol", category: "Personal Care", price: 290, quantity: 30, unit: "Packets", threshold: 10, expiryDate: "2027-08-01" },
  { id: 12, productId: "PRD-012", name: "Nescafe", category: "Beverages", price: 640, quantity: 18, unit: "Packets", threshold: 6, expiryDate: "2027-02-14" },
];

let nextId = 13;
const getNextId = () => nextId++;

module.exports = { users, products, getNextId };