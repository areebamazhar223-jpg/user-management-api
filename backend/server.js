
const express = require("express");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Temporary users array
let users = [
  { id: 1, name: "Areeba", email: "areeba@gmail.com" },
  { id: 2, name: "Ali", email: "ali@gmail.com" }
];

let nextId = 3;

// Request logging middleware
app.use((req, res, next) => {
  console.log("\nMethod:", req.method);
  console.log("URL:", req.url);
  console.log("Body:", req.body);
  next();
});

// GET: All users
app.get("/users", (req, res) => {
  res.status(200).json({
    success: true,
    users
  });
});

// GET: Single user by ID
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid user ID"
    });
  }

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  res.status(200).json({ user });
});

// POST: Create user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim()
  ) {
    return res.status(400).json({
      message: "Name and email are required"
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({
      message: "Invalid email address"
    });
  }

  const newUser = {
    id: nextId++,
    name: name.trim(),
    email: email.trim().toLowerCase()
  };

  users.push(newUser);

  console.log("User created:", newUser);

  res.status(201).json({
    message: "User created successfully",
    user: newUser
  });
});

// PUT: Update user
app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid user ID"
    });
  }

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim()
  ) {
    return res.status(400).json({
      message: "Name and email are required"
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({
      message: "Invalid email address"
    });
  }

  user.name = name.trim();
  user.email = email.trim().toLowerCase();

  console.log("User updated:", user);

  res.status(200).json({
    message: "User updated successfully",
    user
  });
});

// DELETE: Delete user
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid user ID"
    });
  }

  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  const deletedUser = users.splice(index, 1)[0];

  console.log("User deleted:", deletedUser);

  res.status(200).json({
    message: "User deleted successfully",
    user: deletedUser
  });
});

// Test error route
app.get("/test-error", (req, res, next) => {
  next(new Error("This is a test error"));
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    message: "Internal Server Error"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
