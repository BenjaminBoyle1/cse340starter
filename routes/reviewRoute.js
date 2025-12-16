const express = require("express")
const router = express.Router()

const utilities = require("../utilities")
const reviewController = require("../controllers/reviewController")
const reviewValidate = require("../utilities/review-validation")

const { handleErrors, checkLogin } = utilities

// Add review (must be logged in)
router.post(
  "/add",
  checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  handleErrors(reviewController.addReview)
)

// Edit review form
router.get(
  "/edit/:review_id",
  checkLogin,
  handleErrors(reviewController.buildEditReview)
)

// Update review
router.post(
  "/update",
  checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkUpdateReviewData,
  handleErrors(reviewController.updateReview)
)

// Delete review
router.post(
  "/delete",
  checkLogin,
  handleErrors(reviewController.deleteReview)
)

module.exports = router