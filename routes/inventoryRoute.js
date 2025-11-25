const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inv-validation")

const { handleErrors, checkLogin, checkEmployeeOrAdmin } = utilities

// Management view (PROTECTED)
router.get(
  "/",
  checkLogin,
  checkEmployeeOrAdmin,
  handleErrors(invController.buildManagement)
)

// Add classification (PROTECTED)
router.get(
  "/add-classification",
  checkLogin,
  checkEmployeeOrAdmin,
  handleErrors(invController.buildAddClassification)
)
router.post(
  "/add-classification",
  checkLogin,
  checkEmployeeOrAdmin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  handleErrors(invController.registerClassification)
)

// Add inventory (PROTECTED)
router.get(
  "/add-inventory",
  checkLogin,
  checkEmployeeOrAdmin,
  handleErrors(invController.buildAddInventory)
)
router.post(
  "/add-inventory",
  checkLogin,
  checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  handleErrors(invController.registerInventory)
)

// PUBLIC routes: for site visitors (no auth)
router.get(
  "/type/:classificationID",
  handleErrors(invController.buildByClassificationId)
)
router.get(
  "/detail/:invID",
  handleErrors(invController.buildByItemId)
)
router.get(
  "/triggerError",
  handleErrors(invController.triggerError)
)

module.exports = router
