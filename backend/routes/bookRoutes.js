 const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const bookController =
    require("../controllers/bookController");

// ===============================
// UPLOAD DIRECTORY
// ===============================

const uploadDirectory =
    path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });
}

// ===============================
// MULTER STORAGE
// ===============================

const storage =
    multer.diskStorage({

        destination: function (
            req,
            file,
            cb
        ) {
            cb(
                null,
                uploadDirectory
            );
        },

        filename: function (
            req,
            file,
            cb
        ) {

            const extension =
                path.extname(
                    file.originalname
                );

            const fileName =
                `book-${Date.now()}-${Math.round(
                    Math.random() * 100000
                )}${extension}`;

            cb(
                null,
                fileName
            );
        }
    });

// ===============================
// MULTER CONFIGURATION
// ===============================

const upload =
    multer({

        storage,

        limits: {
            fileSize:
                5 * 1024 * 1024
        },

        fileFilter:
            function (
                req,
                file,
                cb
            ) {

                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                    "image/jpg"
                ];

                if (
                    allowedTypes.includes(
                        file.mimetype
                    )
                ) {
                    cb(
                        null,
                        true
                    );
                } else {
                    cb(
                        new Error(
                            "Only JPG, JPEG, PNG and WEBP images are allowed"
                        )
                    );
                }
            }
    });

// ===============================
// BOOK ROUTES
// ===============================

router.get(
    "/",
    bookController.getBooks
);

router.get(
    "/:id",
    bookController.getBook
);

router.post(
    "/",
    upload.single("image"),
    bookController.createBook
);

router.put(
    "/:id",
    upload.single("image"),
    bookController.updateBook
);

router.delete(
    "/:id",
    bookController.deleteBook
);

module.exports = router;