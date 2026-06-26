const express = require("express");

const router = express.Router();

const issueController = require("./book.circulation.controller");

const isAdmin = require("../../../shared/middleware/isAdmin");

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
router.get("/book-requests", isAdmin, issueController.getAllBookRequests);

// APPROVE BOOK REQUEST
router.patch(
  "/approve-request/:issueId",
  isAdmin,
  issueController.approveRequest,
);

// REJECT BOOK REQUEST
router.patch(
  "/reject-request/:issueId",
  isAdmin,
  issueController.rejectRequest,
);

// =====================================================
// ADMIN RETURN MANAGEMENT
// =====================================================

// GET ALL RETURN REQUESTS
router.get("/return-requests", isAdmin, issueController.getReturnRequests);

// ACCEPT RETURN REQUEST
router.patch(
  "/accept-return-request/:issueId",
  isAdmin,
  issueController.acceptReturnRequest,
);

// =====================================================
// DIRECT ISSUE MANAGEMENT
// =====================================================

router.post("/assign-book", isAdmin, issueController.assignBookToStudent);

// GET ALL ISSUED BOOKS
router.get("/book-issued", isAdmin, issueController.getAllIssuedBooks);

// COLLECT FINE
router.patch("/collect-fine/:issueId", isAdmin, issueController.collectFine);

// ADMIN UPDATE REQUEST STATUS
router.patch(
  "/update-request-status/:issueId",
  isAdmin,
  issueController.updateRequestStatus,
);

router.delete(
  "/delete-request/:issueId",
  isAdmin,
  issueController.deleteRejectedRequest,
);

module.exports = router;
