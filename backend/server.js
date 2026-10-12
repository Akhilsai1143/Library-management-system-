 const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const pool = require("./config/db");

 const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const loanRoutes = require("./routes/loanRoutes");
const reportRoutes = require("./routes/reportRoutes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// UPLOADS FOLDER
// ===============================

const uploadsPath = path.join(
    __dirname,
    "uploads"
);

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, {
        recursive: true
    });
}

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// ===============================
// STATIC UPLOADS
// ===============================

app.use(
    "/uploads",
    express.static(uploadsPath)
);

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
    res.json({
        message:
            "Library Management System API is running"
    });
});

// ===============================
// API ROUTES
// ===============================
 app.use((req, res, next) => {
    console.log("REQUEST RECEIVED:", req.method, req.originalUrl);
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/auth",authRoutes);
console.log(
    "AUTH ROUTES LOADED:",
    authRoutes.stack
        .filter((layer) => layer.route)
        .map((layer) => ({
            path: layer.route.path,
            methods: layer.route.methods
        }))
);

console.log("RUNNING SERVER FILE:", __filename);
app.use(
    "/api/books",
    bookRoutes
);

app.use(
    "/api/members",
    memberRoutes
);

app.use(
    "/api/loans",
    loanRoutes
);

app.use(
    "/api/reports",
    reportRoutes
);

// ===============================
// ERROR HANDLER
// ===============================

app.use(errorHandler);

// ===============================
// START SERVER
// ===============================

async function startServer() {
    try {
        await pool.query("SELECT 1");

        console.log(
            "MySQL database connected successfully"
        );

        app.listen(
            PORT,
            () => {
                console.log(
                    `Server running on port ${PORT}`
                );
            }
        );

    } catch (error) {
        console.error(
            "Database connection failed:",
            error.message
        );

        process.exit(1);
    }
}

startServer();