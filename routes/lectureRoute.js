const { addProduct, getAllProduct, DeleteProduct } = require("../controller/lectureController")

const Router = require("express").Router()

Router
    .get("/user", getAllProduct)
    .post("/add-user", addProduct)

// .put("/update-user/:id", updateUsers)
// .delete("/delete-user/:id", deleteUsers)

// .get("/product", getAllProduct)
// .post("/add-product", addProduct)
// .put("/Update-product/:id", updateProduct)
// .delete("/delete-product/:id", deleteproduct)

module.exports = Router