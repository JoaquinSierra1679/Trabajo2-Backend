import express, { json } from "express"
import ProductManager from "./managers/ProductManager.js";
import productsRouter from "./routes/products-router.js";
import CartManager from "./managers/CartManager.js";
import cartsRouter from "./routes/carts-router.js";

const manager = new ProductManager("./src/jsons/products/products.json")
const cartManager = new CartManager("./src/jsons/carts/cart.json")

const app = express()
app.use(json())

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.listen(8080, ()=>{
    console.log("Server listening on port 8080.")
})

export {manager, cartManager}