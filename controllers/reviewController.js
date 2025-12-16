const reviewModel = require("../models/review-model")
const utilities = require("../utilities")

const reviewController = {}

/* Add a new review (Task 3A) */
reviewController.addReview = async function (req, res) {
  const accountData = res.locals.accountData
  const account_id = accountData.account_id
  const { review_text, inv_id } = req.body

  // Server-side validation was handled earlier
  // If validation failed, user is already redirected with flash

  const result = await reviewModel.addReview(review_text, inv_id, account_id)

  if (result) {
    req.flash("notice", "Your review was added successfully.")
  } else {
    req.flash("notice", "Sorry, we could not add your review.")
  }

  return res.redirect(`/inv/detail/${inv_id}`)
}


/* Build review edit view (Task 3B & 5) */
reviewController.buildEditReview = async function (req, res) {
  const nav = await utilities.getNav()
  const review_id = req.params.review_id
  const accountData = res.locals.accountData

  const review = await reviewModel.getReviewById(review_id)
  if (!review) {
    req.flash("notice", "Review not found.")
    return res.redirect("/account/")
  }

  // Only the author can edit
  if (review.account_id !== accountData.account_id) {
    req.flash("notice", "You are not authorized to edit this review.")
    return res.redirect("/account/")
  }

  const screenName =
    accountData.account_firstname.charAt(0) + accountData.account_lastname

  res.render("reviews/edit", {
    title: "Edit Review",
    nav,
    errors: null,
    notice: null,
    review_text: review.review_text,
    review_id: review.review_id,
    inv_id: review.inv_id,
    screenName,
  })
}

/* Handle review update (Task 5 & 6) */
reviewController.updateReview = async function (req, res) {
  const accountData = res.locals.accountData
  const { review_id, review_text, inv_id } = req.body

  // Make sure this review belongs to the logged in client
  const review = await reviewModel.getReviewById(review_id)
  if (!review || review.account_id !== accountData.account_id) {
    req.flash("notice", "You are not authorized to update this review.")
    return res.redirect("/account/")
  }

  const result = await reviewModel.updateReview(review_id, review_text)

  if (result) {
    req.flash("notice", "Your review was updated successfully.")
  } else {
    req.flash("notice", "Sorry, we could not update your review.")
  }

  // Requirement: after update, deliver Account Admin view with message
  return res.redirect("/account/")
}

/* Handle review delete (Task 3B & 6) */
reviewController.deleteReview = async function (req, res) {
  const accountData = res.locals.accountData
  const { review_id } = req.body

  const review = await reviewModel.getReviewById(review_id)
  if (!review || review.account_id !== accountData.account_id) {
    req.flash("notice", "You are not authorized to delete this review.")
    return res.redirect("/account/")
  }

  const result = await reviewModel.deleteReview(review_id)

  if (result) {
    req.flash("notice", "Your review was deleted successfully.")
  } else {
    req.flash("notice", "Sorry, we could not delete your review.")
  }

  return res.redirect("/account/")
}

module.exports = reviewController