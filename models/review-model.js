const pool = require("../database/index.ejs")

/* Add a new review */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = `
      INSERT INTO public.review (review_text, inv_id, account_id)
      VALUES ($1, $2, $3)
      RETURNING review_id
    `
    const data = await pool.query(sql, [review_text, inv_id, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("addReview error", error)
    return null
  }
}

/* Get reviews for a specific inventory item, newest first */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT
        r.review_id,
        r.review_text,
        to_char(r.review_date, 'YYYY-MM-DD HH24:MI') AS review_date_display,
        CONCAT(LEFT(a.account_firstname, 1), a.account_lastname) AS screen_name
      FROM public.review AS r
      JOIN public.account AS a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("getReviewsByInvId error", error)
    return []
  }
}

/* Get reviews written by a specific account (for Account Admin view) */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `
      SELECT
        r.review_id,
        r.review_text,
        r.inv_id,
        to_char(r.review_date, 'YYYY-MM-DD HH24:MI') AS review_date_display,
        i.inv_make,
        i.inv_model
      FROM public.review AS r
      JOIN public.inventory AS i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getReviewsByAccountId error", error)
    return []
  }
}

/* Get a single review by id */
async function getReviewById(review_id) {
  try {
    const sql = `
      SELECT
        r.review_id,
        r.review_text,
        r.review_date,
        r.inv_id,
        r.account_id,
        i.inv_make,
        i.inv_model
      FROM public.review AS r
      JOIN public.inventory AS i ON r.inv_id = i.inv_id
      WHERE r.review_id = $1
    `
    const data = await pool.query(sql, [review_id])
    return data.rows[0]
  } catch (error) {
    console.error("getReviewById error", error)
    return null
  }
}

/* Update review text */
async function updateReview(review_id, review_text) {
  try {
    const sql = `
      UPDATE public.review
      SET review_text = $1
      WHERE review_id = $2
      RETURNING review_id
    `
    const data = await pool.query(sql, [review_text, review_id])
    return data.rowCount
  } catch (error) {
    console.error("updateReview error", error)
    return null
  }
}

/* Delete review */
async function deleteReview(review_id) {
  try {
    const sql = `
      DELETE FROM public.review
      WHERE review_id = $1
      RETURNING review_id
    `
    const data = await pool.query(sql, [review_id])
    return data.rowCount
  } catch (error) {
    console.error("deleteReview error", error)
    return null
  }
}

module.exports = {
  addReview,
  getReviewsByInvId,
  getReviewsByAccountId,
  getReviewById,
  updateReview,
  deleteReview,
}