const pool = require("../database/index.ejs")

/* ****************************************
 * Register new account
 **************************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql = `
      INSERT INTO account
        (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *
    `
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("registerAccount error", error)
    return null
  }
}

/* ****************************************
 * Get account by email
 **************************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const data = await pool.query(sql, [account_email])
    return data.rows[0]
  } catch (error) {
    console.error("getAccountByEmail error", error)
    return null
  }
}

/* ****************************************
 * Get account by ID
 **************************************** */
async function getAccountById(account_id) {
  try {
    const sql = "SELECT * FROM account WHERE account_id = $1"
    const data = await pool.query(sql, [account_id])
    return data.rows[0]
  } catch (error) {
    console.error("getAccountById error", error)
    return null
  }
}

/* ****************************************
 * Update basic account info
 **************************************** */
async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *
    `
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ])
    return data.rowCount
  } catch (error) {
    console.error("updateAccount error", error)
    return null
  }
}

/* ****************************************
 * Update password (hash)
 **************************************** */
async function updatePassword(account_password, account_id) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *
    `
    const data = await pool.query(sql, [account_password, account_id])
    return data.rowCount
  } catch (error) {
    console.error("updatePassword error", error)
    return null
  }
}

module.exports = {
  registerAccount,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
}