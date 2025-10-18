const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

invCont.buildByClassificationId = async (req, res, next) => {
  const classificationId = req.params.classificationID;
  const data = await invModel.getInventoryByClassificationId(classificationId);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    });
};

invCont.buildByItemId = async (req, res, next) => {
  const invId = req.params.invID;
  const data = await invModel.getItemById(invId);
  const detail = await utilities.buildItemDetail(data);
    let nav = await utilities.getNav();
    const title = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
    res.render("./inventory/detail", {
        title: title,
        nav,
        detail,
    });
};

invCont.triggerError = async function (req, res, next) {
    const err = new Error("This is a forced error.");
    err.status = 500;
    throw err;
}

module.exports = invCont;