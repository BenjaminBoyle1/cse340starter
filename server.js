const path = require("path")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("connect-flash")

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
 * Middleware
 *************************/
// Static files
app.use(express.static(path.join(__dirname, "public")))

// Body parsers (required for req.body)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session + flash (in-memory store – fine for this assignment)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 30 },
  })
)
app.use(flash())

/* ***********************
 * Routes
 *************************/
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)

/* ***********************
 * 404 handler
 *************************/
app.use(async (req, res, next) => {
  const nav = await utilities.getNav()
  res.status(404).render("errors/error", {
    title: "Page Not Found",
    nav,
    message: "Sorry, we couldn't find that page.",
  })
})

/* ***********************
 * Central error handler
 *************************/
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
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"
app.listen(port, () => console.log(`App running at http://${host}:${port}`))