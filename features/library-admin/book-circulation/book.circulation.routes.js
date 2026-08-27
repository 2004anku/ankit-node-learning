const express = require("express");

const router = express.Router();

const issueController = require("./book.circulation.controller");

const isLibraryAdmin = require("../../../shared/middleware/isLibraryAdmin");

const isStudent = require("../../student/_shared/middleware/isStudent");

const validate = require("../../../shared/middleware/form.validation");

const {
  requestBookValidationSchema,
  issueBookValidationSchema,
  approveRequestValidationSchema,
  returnBookValidationSchema,
  collectFineValidationSchema,
} = require("./book.circulation.validation");

// =====================================================
// STUDENT ROUTES
// =====================================================

// STUDENT REQUEST BOOK
router.post(
  "/request-book",
  isStudent,
  validate(requestBookValidationSchema),
  issueController.requestBook,
);

// STUDENT RETURN REQUEST
router.patch(
  "/return-request/:issueId",
  isStudent,
  issueController.returnBookRequest,
);
// =====================================================
// ADMIN REQUEST MANAGEMENT
// =====================================================

// GET ALL PENDING BOOK REQUESTS
router.get(
  "/book-requests",
  isLibraryAdmin,
  issueController.getAllBookRequests,
);

// APPROVE BOOK REQUEST
router.patch(
  "/approve-request/:issueId",
  isLibraryAdmin,
  issueController.approveRequest,
);

// REJECT BOOK REQUEST
router.patch(
  "/reject-request/:issueId",
  isLibraryAdmin,
  issueController.rejectRequest,
);

// =====================================================
// ADMIN RETURN MANAGEMENT
// =====================================================

// GET ALL RETURN REQUESTS
router.get(
  "/return-requests",
  isLibraryAdmin,
  issueController.getReturnRequests,
);

// ACCEPT RETURN REQUEST
router.patch(
  "/accept-return-request/:issueId",
  isLibraryAdmin,
  issueController.acceptReturnRequest,
);

// =====================================================
// DIRECT ISSUE MANAGEMENT
// =====================================================

router.post(
  "/assign-book",
  isLibraryAdmin,
  issueController.assignBookToStudent,
);

// GET ALL ISSUED BOOKS
router.get("/book-issued", isLibraryAdmin, issueController.getAllIssuedBooks);

// COLLECT FINE
router.patch(
  "/collect-fine/:issueId",
  isLibraryAdmin,
  issueController.collectFine,
);

// ADMIN UPDATE REQUEST STATUS
router.patch(
  "/update-request-status/:issueId",
  isLibraryAdmin,
  issueController.updateRequestStatus,
);

router.delete(
  "/delete-request/:issueId",
  isLibraryAdmin,
  issueController.deleteRejectedRequest,
);

module.exports = router;
