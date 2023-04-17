import { json, Router } from "express";
import { manager } from "../app.js";

const viewsRouter = Router()
viewsRouter.use(json())

viewsRouter.get("/", async (req, res) => {
    const { page, limit, sort, title, stock } = req.query
    const query = {title, stock}
    const products = await manager.getProducts(page, limit, sort, query)
    res.render("home", { products })
})

viewsRouter.get("/real-time-products", async (req, res) => {
    const { page, limit, sort, title, stock } = req.query
    const query = {title, stock}
    const products = await manager.getProducts(page, limit, sort, query)
    res.render("real-time-products", { products })
})

viewsRouter.get("/chat", async (req, res) => {
    res.render("chat")
})
