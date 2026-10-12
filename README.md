
# 📚 LibraSys – Library Management System


LibraSys is a full-stack web application designed to simplify library operations. It helps librarians manage books, library members, borrowing and returning books, and library reports through a user-friendly interface.

The application includes a reader portal where users can explore available books and view their borrowing history.

## ✨ Features

### 🔐 Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Role-based access for administrators and readers

### 📖 Book Management
- Add new books to the collection
- View all registered books
- Update book information
- Delete books
- Track total and available copies
- Organize books by category

### 👥 Member Management
- Register library members
- View member details
- Update member information
- Delete members
- Track member status

### 🔄 Borrowing and Returning
- Issue books to library members
- Set borrowing and due dates
- Record book returns
- Track borrowing status
- Update available book copies

### 📊 Reports and Dashboard
- View library statistics
- Track total books and available copies
- Monitor borrowed books
- View borrowing information and library activity

### 👤 Reader Portal
- Browse the available book collection
- Search and filter books
- View available copies
- Access personal borrowing history
- Log in and log out of the application

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- React Router

### Backend
- Node.js
- Express.js
- REST API

### Database
- MySQL
- MySQL2

### Authentication and Security
- JSON Web Tokens (JWT)
- bcrypt / bcryptjs
- Environment variables using dotenv

### Development Tools
- Visual Studio Code
- Postman
- Git and GitHub
- Vite
- Nodemon

## 📁 Project Structure

```text
Library-management-system/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── memberController.js
│   │   ├── loanController.js
│   │   └── reportController.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── authModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── loanRoutes.js
│   │   └── reportRoutes.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── index.html
│
└── README.md
```

*Note: The structure above is illustrative. Adjust filenames and folders to match your actual project.*

## ⚙️ Prerequisites

Install the following before running the application:

- Node.js and npm
- MySQL Server
- MySQL Workbench (optional)
- Git

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Library-management-system
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Set up the database

Open MySQL Workbench and create the database:

```sql
CREATE DATABASE library_db;
USE library_db;
```

Create the required tables for users, books, members, and loans according to the database schema used by your backend.

Ensure the tables have the appropriate primary keys, foreign keys, and constraints.

### 3. Configure the backend

Open a terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=library_db
JWT_SECRET=your_long_random_secret
```

Replace the database credentials and JWT secret with your own values.

**Important:** Never upload your `.env` file or real passwords to GitHub.

### 4. Start the backend

From the `backend` folder, run:

```bash
node server.js
```

If your project has a Nodemon script configured, you can use:

```bash
npm run dev
```

The backend should run at:

```text
http://localhost:5000
```

You can check the root endpoint by opening it in your browser:

```text
http://localhost:5000/
```

### 5. Configure and start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local frontend URL in your terminal. Open that URL in your browser.

## 🔗 API Endpoints

The backend exposes REST API routes for the following operations:

| Module | Base Endpoint | Operations |
|---|---|---|
| Authentication | `/api/auth` | Register and login |
| Books | `/api/books` | Create, read, update, delete |
| Members | `/api/members` | Manage library members |
| Loans | `/api/loans` | Borrowing and returning |
| Reports | `/api/reports` | Library reports |

Example endpoints:

```text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/books
POST   /api/books
PUT    /api/books/:id
DELETE /api/books/:id

GET    /api/members
GET    /api/loans
```

The exact supported endpoints may vary according to your route implementation.

## 🗄️ Database Relationships

The application uses MySQL to store and organize library information.

- **Books and Loans:** One book can be associated with multiple loan records over time.
- **Members and Loans:** One member can have multiple loan records over time.
- **Users and Members:** A reader account can be associated with a library member record.

Primary keys uniquely identify records, while foreign keys maintain relationships between related tables.

## 🔄 Application Workflow

1. A user registers or logs in.
2. The frontend sends HTTP requests to the Express backend.
3. The backend validates incoming data.
4. The backend interacts with MySQL through database queries.
5. MySQL returns the requested results.
6. The backend sends JSON responses to the frontend.
7. React updates the interface to display the latest information.

## 🧪 Testing

Use Postman to test the backend API endpoints.

Recommended checks:

- Register a new reader account.
- Log in with valid credentials.
- Add and retrieve a book.
- Update book details.
- Register and retrieve a member.
- Borrow an available book.
- Return a borrowed book.
- Verify available-copy counts and borrowing records.
- Test invalid inputs and duplicate records.

## 🔒 Security Notes

- Store secrets in environment variables.
- Hash passwords before storing them.
- Validate and sanitize incoming data.
- Verify JWTs on protected backend routes.
- Enforce role permissions on the server.
- Keep `.env` and private credentials out of version control.

## 🎯 Project Objective

The main objective of LibraSys is to reduce manual library work by providing a centralized system for book management, member registration, borrowing, returns, and reporting.

The project also provides practical experience with React, REST APIs, Express.js, MySQL, database relationships, and authentication.

## 👨‍💻 Author

**Muthulluru Akhil Sai**

GitHub: [Akhilsai1143](https://github.com/Akhilsai1143)

LinkedIn: [Connect with me](https://www.linkedin.com/in/akhil-chowdary-0a7295268/)

---

⭐ If you find this project useful, consider giving the repository a star!
