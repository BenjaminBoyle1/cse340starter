const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const utilities = require("../utilities")

const accountValidate = {}

/* ****************************************
 * Registration rules
 **************************************** */
accountValidate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const account = await accountModel.getAccountByEmail(account_email)
        if (account) {
          throw new Error("Email exists. Please log in or use a different email.")
        }
      }),
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters long and contain upper and lower case letters, a number, and a special character."
      ),
  ]
}

/* ****************************************
 * Check registration data
 **************************************** */
accountValidate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email } = req.body

  if (!errors.isEmpty()) {
    return res.status(400).render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      notice: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* ****************************************
 * Login rules
 **************************************** */
accountValidate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* ****************************************
 * Check login data
 **************************************** */
accountValidate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const { account_email } = req.body

  if (!errors.isEmpty()) {
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      notice: null,
      account_email,
    })
  }
  next()
}

/* ****************************************
 * UPDATE ACCOUNT rules (Task 5)
 **************************************** */
accountValidate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id
        const existingAccount = await accountModel.getAccountByEmail(
          account_email
        )

        if (!existingAccount) return true
        if (existingAccount.account_id == account_id) return true

        throw new Error("That email address is already in use.")
      }),
  ]
}

/* ****************************************
 * Check UPDATE ACCOUNT data
 **************************************** */
accountValidate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const account_id = req.body.account_id
  const accountData = await accountModel.getAccountById(account_id)

  if (!errors.isEmpty()) {
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      notice: null,
      accountData,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    })
  }
  next()
}

/* ****************************************
 * UPDATE PASSWORD rules (Task 5)
 **************************************** */
accountValidate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters long and contain upper and lower case letters, a number, and a special character."
      ),
  ]
}

/* ****************************************
 * Check UPDATE PASSWORD data
 **************************************** */
accountValidate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(req.body.account_id)

  if (!errors.isEmpty()) {
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      notice: null,
      accountData,
    })
  }
  next()
}

module.exports = accountValidate
