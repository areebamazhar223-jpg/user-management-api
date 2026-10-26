const express = require("express");

const app = express();
const PORT = 3000;

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// Custom middleware: log every incoming request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Temporary in-memory user data (no MongoDB)
let users = [
  { id: 1, name: "Areeba Mazhar", email: "areeba@example.com", age: 23 },
  { id: 2, name: "Ali Ahmed", email: "ali@example.com", age: 25 },
  { id: 3, name: "Sara Khan", email: "sara@example.com", age: 22 },
];

// Generate the next ID
let nextId = 4;

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the User Management API",
    endpoints: [
      "GET /api/users",
      "GET /api/users/:id",
      "POST /api/users",
      "PUT /api/users/:id",
      "PATCH /api/users/:id",
      "DELETE /api/users/:id",
    ],
  });
});

// GET: Get all users
app.get("/api/users", (req, res) => {
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// GET: Get one user by ID
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      success: false,
      message: "User ID must be a positive integer",
    });
  }

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// POST: Create a new user
app.post("/api/users", (req, res) => {
  const { name, email, age } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    age === undefined ||
    age === null ||
    age === "" ||
    !Number.isInteger(Number(age)) ||
    Number(age) < 1
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, email and a positive integer age are required",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const emailExists = users.some(
    (user) => user.email.toLowerCase() === normalizedEmail
  );

  if (emailExists) {
    return res.status(409).json({
      success: false,
      message: "A user with this email already exists",
    });
  }

  const newUser = {
    id: nextId++,
    name: name.trim(),
    email: normalizedEmail,
    age: Number(age),
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: newUser,
  });
});

// PUT: Replace all editable fields of an existing user
app.put("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      success: false,
      message: "User ID must be a positive integer",
    });
  }

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const { name, email, age } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    age === undefined ||
    age === null ||
    age === "" ||
    !Number.isInteger(Number(age)) ||
    Number(age) < 1
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, email and a positive integer age are required",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const emailExists = users.some(
    (user) =>
      user.id !== id &&
      user.email.toLowerCase() === normalizedEmail
  );

  if (emailExists) {
    return res.status(409).json({
      success: false,
      message: "A user with this email already exists",
    });
  }

  users[userIndex] = {
    id,
    name: name.trim(),
    email: normalizedEmail,
    age: Number(age),
  };

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: users[userIndex],
  });
});

// PATCH: Update selected fields of an existing user
app.patch("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      success: false,
      message: "User ID must be a positive integer",
    });
  }

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const { name, email, age } = req.body;
  const updates = {};

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update",
    });
  }

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name must be a non-empty string",
      });
    }
    updates.name = name.trim();
  }

  if (email !== undefined) {
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email must be a non-empty string",
      });
    }
    updates.email = email.trim().toLowerCase();
  }

  if (age !== undefined) {
    if (
      age === null ||
      age === "" ||
      !Number.isInteger(Number(age)) ||
      Number(age) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Age must be a positive integer",
      });
    }
    updates.age = Number(age);
  }

  if (
    updates.email &&
    users.some(
      (other) =>
        other.id !== id &&
        other.email.toLowerCase() === updates.email
    )
  ) {
    return res.status(409).json({
      success: false,
      message: "A user with this email already exists",
    });
  }

  Object.assign(user, updates);

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

// DELETE: Delete a user by ID
app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      success: false,
      message: "User ID must be a positive integer",
    });
  }

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: deletedUser,
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Handle malformed JSON request bodies
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body",
    });
  }

  next(err);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});