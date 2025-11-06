const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")

// Classification rules
const classificationRules = () => [
  body("classification_name")
    .trim()
    .notEmpty().withMessage("Classification name is required.")
    .matches(/^[A-Za-z]+$/)
    .withMessage("Classification name must contain alphabetic letters only (no numbers, spaces, or special characters)."),
]


// Inventory rules
const inventoryRules = () => [
  body("inv_make").trim().notEmpty().withMessage("Make is required."),
  body("inv_model").trim().notEmpty().withMessage("Model is required."),
  body("inv_year").isInt({ min: 1886, max: 3000 }).withMessage("Enter a valid year."),
  body("inv_description").trim().notEmpty().withMessage("Description is required."),
  body("inv_image").trim().notEmpty().withMessage("Image path is required."),
  body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
  body("inv_price").isFloat({ min: 0 }).withMessage("Price must be 0 or more."),
  body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be 0 or more."),
  body("inv_color").trim().notEmpty().withMessage("Color is required."),
  body("classification_id").isInt({ min: 1 }).withMessage("Choose a classification."),
]

// Classification validation
const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  const { classification_name } = req.body
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.status(400).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      notice: null,
      classification_name,
    })
  }
  next()
}

// Inventory validation (sticky form)
const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    return res.status(400).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      notice: null,
      ...req.body,
    })
  }
  next()
}

module.exports = {
  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData,
}
