require("./models/User");
require("./models/Track")
const express = require("express")
const mongoose = require("mongoose")
const authRoutes = require("./routes/authRoutes")
const trackRoutes = require("./routes/trackRoute")
const bodyParser = require("body-parser")
const requireAuth = require("./middlewares/requireAuth")
require("dotenv").config({
    path: "./src/.env"
});

const app = express();

// Middlewares

app.use(bodyParser.json())

//Routes

app.use(authRoutes);
app.use(trackRoutes)

// Database

const mongoUri = process.env.MONGO_URI;
mongoose.set("strictQuery", true);
mongoose.connect(mongoUri)



mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB.")
})

mongoose.connection.on("error", (err) => {
    console.error(err)
})

app.get("/", requireAuth, (req, res) => {
    res.send(`Your email : ${req.user.email}`)
})

// Server Listen

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})