const express = require("express")
const router = express.Router()

const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const accountValidate = require("../utilities/account-validation")

const { handleErrors, checkLogin } = utilities

// Login
router.get("/login", handleErrors(accountController.buildLogin))
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  handleErrors(accountController.accountLogin)
)

// Register
router.get("/register", handleErrors(accountController.buildRegister))
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  handleErrors(accountController.registerAccount)
)

// Account Management (protected)
router.get(
  "/",
  checkLogin,
  handleErrors(accountController.buildAccountManagement)
)

// Account Update view
router.get(
  "/update/:account_id",
  checkLogin,
  handleErrors(accountController.buildUpdateAccount)
)

// Handle Account info update
router.post(
  "/update",
  checkLogin,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateData,
  handleErrors(accountController.updateAccount)
)

// Handle Password change
router.post(
  "/update-password",
  checkLogin,
  accountValidate.updatePasswordRules(),
  accountValidate.checkPasswordData,
  handleErrors(accountController.updatePassword)
)

// Logout
router.get("/logout", handleErrors(accountController.logoutClient))

module.exports = router
