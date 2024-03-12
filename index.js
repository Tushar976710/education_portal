const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config({ path: "./.env" })
const cookieParser = require("cookie-parser")
//db
mongoose.connect(process.env.MONGO_URL)
const app = express()
//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.static("video"))



//routes
app.use("/api/v1/auth", require("./routes/authRoute"))
app.use("/api/v1/upload", require("./routes/lectureRoute"))

//404

app.use("*", (req, res) => {
    res.status(404).json({ message: "Resourese not found" })
})
//error handling
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: err.nessage || "something went wrong" })
})
//server
mongoose.connection.once("open", () => {
    console.log("mongoo connected");
    app.listen(process.env.PORT, console.log("server running"))
})