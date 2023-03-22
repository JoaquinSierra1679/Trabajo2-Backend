import express, { json } from "express"
import ProductManager from "./managers/ProductManager.js";
import productsRouter from "./routes/products-router.js";
import CartManager from "./managers/CartManager.js";
import cartsRouter from "./routes/carts-router.js";
import {engine} from "express-handlebars"
import { Server } from "socket.io";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views-router.js";

const manager = new ProductManager("./src/jsons/products/products.json")
const cartManager = new CartManager("./src/jsons/carts/cart.json")

const app = express()
app.use(json())

app.use(express.static(__dirname + '/../public'))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

const httpServer = app.listen(8080, ()=>{
    console.log("Server listening on port 8080.")
})

const io = new Server(httpServer)

io.on("connection", (socket)=>{
    console.log("New client connected.")
})

app.use((req,res,next)=>{
    req.io = io
    next()
})

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)

export {manager, cartManager}