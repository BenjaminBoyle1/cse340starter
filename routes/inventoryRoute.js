const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const { handleErrors } = require("../utilities")
const invValidate = require("../utilities/inv-validation")

// Management view
router.get("/", handleErrors(invController.buildManagement))

// Add classification
router.get("/add-classification", handleErrors(invController.buildAddClassification))
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  handleErrors(invController.registerClassification)
)

// Add inventory
router.get("/add-inventory", handleErrors(invController.buildAddInventory))
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  handleErrors(invController.registerInventory)
)

// Existing routes
router.get("/type/:classificationID", handleErrors(invController.buildByClassificationId))
router.get("/detail/:invID", handleErrors(invController.buildByItemId))
router.get("/triggerError", handleErrors(invController.triggerError))

module.exports = router
