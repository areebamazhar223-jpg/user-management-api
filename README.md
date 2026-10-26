# User Management REST API

A RESTful User Management API built with **Node.js** and **Express.js** to perform CRUD (Create, Read, Update, Delete) operations on users.

This project demonstrates core backend development concepts using a temporary JavaScript array instead of a database.

## Features

- Express.js server setup
- Get all users
- Get a single user by ID
- Create a new user
- Update existing user details
- Delete a user
- JSON request and response handling
- Custom request logging middleware
- Input validation and email validation
- Error-handling middleware
- Appropriate HTTP status codes
- Temporary in-memory data storage

## Technologies Used

- Node.js
- Express.js
- JavaScript
- REST API
- JSON

## Project Structure

```text
user-management-api/
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/user-management-api.git
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Navigate to the Project Folder

```bash
cd user-management-api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

The server will run at:

`http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Retrieve all users |
| GET | `/users/:id` | Retrieve a user by ID |
| POST | `/users` | Create a new user |
| PUT | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |
| GET | `/test-error` | Test error-handling middleware |

## API Testing

You can test the endpoints using [Postman](https://www.postman.com/).

### Get All Users

**GET** `/users`

### Get a Single User

**GET** `/users/1`

### Create a User

**POST** `/users`

Set the request body to raw JSON:

```json
{
  "name": "Ahmed",
  "email": "ahmed@gmail.com"
}
```

### Update a User

**PUT** `/users/1`

```json
{
  "name": "Ahmed Khan",
  "email": "ahmedkhan@gmail.com"
}
```

### Delete a User

**DELETE** `/users/1`

## HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 | Request successful |
| 201 | User created successfully |
| 400 | Invalid request data |
| 404 | User or route not found |
| 500 | Internal server error |

## Middleware

The API uses Express middleware to:

- Parse incoming JSON request bodies using `express.json()`.
- Log HTTP methods, URLs, and request bodies.
- Handle errors and return JSON error responses.
- Respond appropriately to unknown routes.

## Data Storage

This project uses an in-memory JavaScript array to store users temporarily. It does not use MongoDB or any other database.

**Note:** User data resets when the server restarts.

## Learning Objectives

This project demonstrates practical understanding of:

- Node.js and Express.js
- RESTful API design
- HTTP methods and status codes
- Request parameters and request bodies
- Middleware
- JSON responses
- CRUD operations
- Basic input validation and error handling

## Future Improvements

- Add automated API tests.
- Implement pagination and search.
- Improve email validation and duplicate-email handling.
- Add a database when persistent storage is required.

## License

This project is available under the MIT License.
