const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const auth = require("../../../shared/middleware/auth");
const isLibraryAdmin = require("../../../shared/middleware/isAdmin");

const dataTransferController = require("./data.transfer.controller");

// ===================================================
// CREATE UPLOAD FOLDER IF NOT EXISTS
// ===================================================

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ===================================================
// MULTER CONFIGURATION
// ===================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// ===================================================
// FILE FILTER
// ===================================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".xlsx", ".xls"];

  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedTypes.includes(extension)) {
    return cb(new Error("Only Excel (.xlsx, .xls) files are allowed"), false);
  }

  cb(null, true);
};

// ===================================================
// MULTER
// ===================================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ===================================================
// PREVIEW BOOK IMPORT
// ===================================================

router.post(
  "/books/preview",
  auth,
  isLibraryAdmin,
  upload.single("file"),
  dataTransferController.previewBooks,
);

// ===================================================
// IMPORT BOOKS
// ===================================================

router.post(
  "/books/import",
  auth,
  isLibraryAdmin,
  dataTransferController.importBooks,
);

// ==========================================
// PREVIEW STUDENTS
// ==========================================

router.post(
  "/students/preview",
  auth,
  isLibraryAdmin,
  upload.single("file"),
  dataTransferController.previewStudents,
);

// ==========================================
// IMPORT STUDENTS
// ==========================================

router.post(
  "/students/import",
  auth,
  isLibraryAdmin,
  dataTransferController.importStudents,
);
// ==========================================
// EXPORT BOOKS
// ==========================================

router.get(
  "/books/export",
  auth,
  isLibraryAdmin,
  dataTransferController.exportBooks,
);

// ==========================================
// EXPORT STUDENTS
// ==========================================

router.get(
  "/students/export",
  auth,
  isLibraryAdmin,
  dataTransferController.exportStudents,
);
module.exports = router;
