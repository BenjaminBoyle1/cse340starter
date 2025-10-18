/* ******************************************
 * Primary app file
 ******************************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const path = require("path")
const static = express.static(path.join(__dirname, "/public"))
const app = express()

// Routers & controllers
const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")

/* ***********************
 * View Engine & Layouts
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
// Static files
app.use(static);
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", utilities.handleErrors(inventoryRoute));
// 404 (no route matched)
app.use(async (req, res, next) => {
  const nav = await utilities.getNav()
  res.status(404).render("errors/error", {
    title: "Page Not Found",
    nav,
    message: "Sorry, we couldn't find that page.",
  })
})

// Central error handler
app.use(async (err, req, res, next) => {
  console.error(err)
  const nav = await utilities.getNav()
  const status = err.status || 500
  res.status(status).render("errors/error", {
    title: status === 404 ? "Page Not Found" : "Server Error",
    nav,
    message: err.message || "Something went wrong.",
  })
})


/* ***********************
 * Server
 *************************/
const port = process.env.PORT
const host = process.env.HOST

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
