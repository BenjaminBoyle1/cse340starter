const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const accountModel = require("../models/account-model")
const utilities = require("../utilities")

const accountController = {}

/* ****************************************
 * Login view
 **************************************** */
accountController.buildLogin = async function (req, res) {
  const nav = await utilities.getNav()
  const notice = req.flash("notice")[0] || null
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    notice,
    account_email: "",
  })
}

/* ****************************************
 * Register view
 **************************************** */
accountController.buildRegister = async function (req, res) {
  const nav = await utilities.getNav()
  const notice = req.flash("notice")[0] || null
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    notice,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  })
}

/* ****************************************
 * Process registration
 **************************************** */
accountController.registerAccount = async function (req, res) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } =
    req.body

  const hashedPassword = await bcrypt.hash(account_password, 10)

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      "Congratulations, you are registered. Please log in."
    )
    const notice = req.flash("notice")[0] || null
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      notice,
      account_email: account_email,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    const notice = req.flash("notice")[0] || null
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      notice,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
 * Process login
 **************************************** */
accountController.accountLogin = async function (req, res) {
  const nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    const notice = req.flash("notice")[0] || null
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      notice,
      account_email,
    })
  }

  const validPassword = await bcrypt.compare(
    account_password,
    accountData.account_password
  )

  if (!validPassword) {
    req.flash("notice", "Please check your credentials and try again.")
    const notice = req.flash("notice")[0] || null
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      notice,
      account_email,
    })
  }

  // Build JWT payload
  const payload = {
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_type: accountData.account_type,
  }

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  })

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    maxAge: 3600000,
  })

  res.locals.loggedin = true
  res.locals.accountData = payload

  return res.redirect("/account/")
}

/* ****************************************
 * Account Management view (Task 3)
 **************************************** */
accountController.buildAccountManagement = async function (req, res) {
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData
  const notice = req.flash("notice")[0] || null

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    notice,
    accountData,
  })
}

/* ****************************************
 * Update Account view (Task 4)
 **************************************** */
accountController.buildUpdateAccount = async function (req, res) {
  const nav = await utilities.getNav()
  const account_id = req.params.account_id
  const accountData = await accountModel.getAccountById(account_id)
  const notice = req.flash("notice")[0] || null

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    notice,
    accountData,
  })
}

/* ****************************************
 * Handle Account info update (Task 5)
 **************************************** */
accountController.updateAccount = async function (req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
  } else {
    req.flash("notice", "Sorry, the account update failed.")
  }

  const updatedAccount = await accountModel.getAccountById(account_id)

  // Re-issue JWT so header info is fresh
  const payload = {
    account_id: updatedAccount.account_id,
    account_firstname: updatedAccount.account_firstname,
    account_lastname: updatedAccount.account_lastname,
    account_email: updatedAccount.account_email,
    account_type: updatedAccount.account_type,
  }
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  })
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    maxAge: 3600000,
  })
  res.locals.accountData = payload
  res.locals.loggedin = true

  const notice = req.flash("notice")[0] || null

  return res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    notice,
    accountData: payload,
  })
}

/* ****************************************
 * Handle Password change (Task 5)
 **************************************** */
accountController.updatePassword = async function (req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await accountModel.updatePassword(
      hashedPassword,
      account_id
    )

    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
    } else {
      req.flash("notice", "Sorry, password update failed.")
    }

    const accountData = await accountModel.getAccountById(account_id)
    const notice = req.flash("notice")[0] || null

    return res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      notice,
      accountData,
    })
  } catch (error) {
    console.error(error)
    req.flash("notice", "An error occurred while updating your password.")
    const accountData = await accountModel.getAccountById(account_id)
    const notice = req.flash("notice")[0] || null

    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      notice,
      accountData,
    })
  }
}

/* ****************************************
 * Logout (Task 6)
 **************************************** */
accountController.logoutClient = async function (req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

module.exports = accountController
