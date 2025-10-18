const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildItemDetail = async function (data) {
  let detail = "";

  // Handle missing data
  if (!data || data.length === 0) {
    const error = new Error("404: Vehicle not found. Please try again.");
    error.status = 404;
    throw error;
  }

  // Safely get first vehicle object
  const v = data[0];

  // Fallbacks for undefined fields
  const year = v.inv_year ?? "";
  const make = v.inv_make ?? "";
  const model = v.inv_model ?? "";
  const desc = v.inv_description ?? "";
  const color = v.inv_color ?? "";
  const miles = v.inv_miles ?? 0;
  const price = v.inv_price ?? 0;
  const img = v.inv_image ?? v.inv_thumbnail ?? "";

  // Build heading cleanly (skip undefined)
  const heading = [year, make, model].filter(Boolean).join(" ");

  // Build HTML safely
  detail += '<div id="inv-detail-display">';
  detail +=
    '<img src="' +
    img +
    '" alt="Image of ' +
    heading +
    ' on CSE Motors" />';
  detail += '<div class="inv-detail-info">';
  detail += "<h2>" + heading + "</h2>";
  detail += "<hr />";
  detail +=
    '<p class="inv-price">$' +
    new Intl.NumberFormat("en-US").format(price) +
    "</p>";

  // Only render description if it exists
  if (desc) {
    detail += "<p>" + desc + "</p>";
  }

  detail += "<ul>";
  if (color) {
    detail += "<li>Color: " + color + "</li>";
  }
  detail +=
    "<li>Miles: " +
    new Intl.NumberFormat("en-US").format(miles) +
    "</li>";
  detail += "</ul>";
  detail += "</div>";
  detail += "</div>";

  return detail;
};


Util.handleErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}


module.exports = Util