const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")

const reviewValidate = {}

/* Rules for review text */
reviewValidate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .notEmpty()
      .withMessage("Review text is required.")
      .isLength({ min: 5 })
      .withMessage("Review must be at least 5 characters long."),
  ]
}

/* Check data when adding a review */
reviewValidate.checkReviewData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {

    const firstError = errors.array()[0].msg
    req.flash("notice", firstError)

    // --- STORE STICKY REVIEW TEXT ---
    req.flash("review_text", req.body.review_text)

    return res.redirect(`/inv/detail/${req.body.inv_id}`)
  }
  next()
}

/* Check data when updating a review */
reviewValidate.checkUpdateReviewData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const { review_id, inv_id, screenName } = req.body
    const firstError = errors.array()[0].msg

    return res.status(400).render("reviews/edit", {
      title: "Edit Review",
      nav,
      errors: errors.array(),
      notice: firstError,
      review_text: req.body.review_text,
      review_id,
      inv_id,
      screenName,
    })
  }
  next()
}

module.exports = reviewValidate