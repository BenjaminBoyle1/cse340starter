const pool = require("../database/index.ejs")

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            "SELECT * FROM public.classification AS c LEFT JOIN public.inventory AS i ON i.classification_id = c.classification_id WHERE c.classification_id = $1", [classification_id]
        );
        return data.rows;
    } catch (error) {
        console.error("getclassificationbyid error " + error);
    }
}

async function getItemById(inv_id) {
    try {
        const data = await pool.query(
            "SELECT * FROM public.inventory AS i WHERE i.inv_id = $1", [inv_id]
        );
        console.log(data.rows);
        return data.rows;
    } catch (error) {
        console.error("getItemById error " + error);
    }
}
/* --- ADD: list classifications for select --- */
async function getClassifications() {
  const sql = `SELECT classification_id, classification_name
               FROM public.classification
               ORDER BY classification_name`
  const result = await pool.query(sql)
  return result // caller expects { rows: [...] }
}

/* --- ADD: insert classification --- */
async function addClassification(classification_name) {
  try {
    const sql = `INSERT INTO public.classification (classification_name)
                 VALUES ($1)`
    const data = await pool.query(sql, [classification_name])
    return data.rowCount === 1
  } catch (e) {
    console.error("addClassification error:", e)
    return false
  }
}

/* --- ADD: insert inventory item --- */
async function addInventory(p) {
  try {
    const sql = `
      INSERT INTO public.inventory
        (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
         inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`
    const params = [
      p.inv_make, p.inv_model, p.inv_year, p.inv_description,
      p.inv_image, p.inv_thumbnail, p.inv_price, p.inv_miles,
      p.inv_color, p.classification_id
    ]
    const data = await pool.query(sql, params)
    return data.rowCount === 1
  } catch (e) {
    console.error("addInventory error:", e)
    return false
  }
}

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getItemById,
    getClassifications,
    addClassification,
    addInventory,
};
