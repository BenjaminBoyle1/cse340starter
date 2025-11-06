const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ----- Existing ----- */
invCont.buildByClassificationId = async (req, res, next) => {
  const classificationId = req.params.classificationID
  const data = await invModel.getInventoryByClassificationId(classificationId)
  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid,
  })
}

invCont.buildByItemId = async (req, res, next) => {
  const invId = req.params.invID
  const data = await invModel.getItemById(invId)
  const detail = await utilities.buildItemDetail(data)
  const nav = await utilities.getNav()
  const title = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", { title, nav, detail })
}

invCont.triggerError = async function (req, res, next) {
  const err = new Error("This is a forced error.")
  err.status = 500
  throw err
}

/* ----- Task 1: Management view ----- */
invCont.buildManagement = async (req, res) => {
  const nav = await utilities.getNav()
  const notice = req.flash("notice")[0]
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    notice,
    errors: null,
  })
}

/* ----- Task 2: Add Classification ----- */
invCont.buildAddClassification = async (req, res) => {
  const nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    notice: null,
    classification_name: "",
  })
}

invCont.registerClassification = async (req, res) => {
  const { classification_name } = req.body
  const success = await invModel.addClassification(classification_name)
  if (success) {
    req.flash("notice", "Classification added successfully.")
    return res.redirect("/inv")
  } else {
    const nav = await utilities.getNav()
    res.status(400).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      notice: "Failed to add classification.",
      classification_name,
    })
  }
}

/* ----- Task 3: Add Inventory ----- */
invCont.buildAddInventory = async (req, res) => {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    notice: null,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
  })
}

invCont.registerInventory = async (req, res) => {
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id,
  } = req.body

  const success = await invModel.addInventory({
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id,
  })

  if (success) {
    req.flash("notice", "Inventory item added successfully.")
    return res.redirect("/inv")
  } else {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)
    res.status(400).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      notice: "Failed to add inventory item.",
      ...req.body,
    })
  }
}

module.exports = invCont
