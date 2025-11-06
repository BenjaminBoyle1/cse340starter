const invModel = require("../models/inventory-model")
const Util = {}

Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += `<li><a href="/inv/type/${row.classification_id}"
                title="See our inventory of ${row.classification_name} vehicles">
                ${row.classification_name}</a></li>`
  })
  list += "</ul>"
  return list
}

Util.buildClassificationGrid = async function (data) {
  let grid = ""
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((v) => {
      grid += `<li>
        <a href="../../inv/detail/${v.inv_id}" title="View ${v.inv_make} ${v.inv_model} details">
          <img src="${v.inv_image}" alt="Image of ${v.inv_make} ${v.inv_model} on CSE Motors">
        </a>
        <div class="namePrice">
          <hr>
          <h2><a href="../../inv/detail/${v.inv_id}" title="View ${v.inv_make} ${v.inv_model} details">
            ${v.inv_make} ${v.inv_model}</a></h2>
          <span>$${new Intl.NumberFormat("en-US").format(v.inv_price)}</span>
        </div>
      </li>`
    })
    grid += "</ul>"
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildItemDetail = async function (data) {
  if (!data || data.length === 0) {
    const error = new Error("404: Vehicle not found.")
    error.status = 404
    throw error
  }
  const v = data[0]
  const title = `${v.inv_year ?? ""} ${v.inv_make ?? ""} ${v.inv_model ?? ""}`
  return `
    <div id="inv-detail-display">
      <img src="${v.inv_image}" alt="Image of ${title} on CSE Motors">
      <div class="inv-detail-info">
        <h2>${title}</h2><hr>
        <p class="inv-price">$${new Intl.NumberFormat("en-US").format(v.inv_price)}</p>
        <p>${v.inv_description ?? ""}</p>
        <ul>
          <li>Color: ${v.inv_color ?? "N/A"}</li>
          <li>Miles: ${new Intl.NumberFormat("en-US").format(v.inv_miles ?? 0)}</li>
        </ul>
      </div>
    </div>`
}

Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications()
  let html = `<select name="classification_id" id="classificationList" required>
                <option value=''>Choose a Classification</option>`
  data.rows.forEach((row) => {
    const selected =
      classification_id && Number(row.classification_id) === Number(classification_id)
        ? " selected"
        : ""
    html += `<option value="${row.classification_id}"${selected}>${row.classification_name}</option>`
  })
  html += "</select>"
  return html
}

Util.handleErrors = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
