import { json, query, Router } from "express";
import { manager } from "../app.js";

const productsRouter = Router()
productsRouter.use(json())

productsRouter.get("/", async (req, res) => {
    try {
        const { limit, page, sort, title, stock } = req.query
        const query = {title, stock}
        const products = await manager.getProducts(page, limit, sort, query)

        res.send({ status: "succes", payload: products })
    } catch (err) {
        res.status(404).send({ status: "error", error: `${err}` })
    }
})

productsRouter.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params
        const product = await manager.getProductById(pid)
        res.send({ status: "succes", payload: product })
    } catch (err) {
        res.status(404).send({ status: "error", error: `${err}` })
    }
})

productsRouter.post("/", async (req, res) => {
    try {
        // En el body no envío "thumbail" ni "status", los defino por defecto hasta que tenga que cambiarlo
        const { title, description, price, thumbail, code, stock, status, category } = req.body
        await manager.addProduct(title, description, parseInt(price), thumbail, code, parseInt(stock), status, category)
        req.io.emit("new-product", req.body)
        res.send({ status: "succes", payload: req.body })
    } catch (err) {
        res.status(404).send({ status: "error", error: `${err}` })
    }
})

productsRouter.put("/:pid", async (req, res) => {
    try {
        const { limit, page, sort, title, stock } = req.query
        const query = {title, stock}
        const { pid } = req.params
        await manager.updateProduct(pid, req.body)

        const products = await manager.getProducts(page, limit, sort, query)
        req.io.emit("update-product", products.docs)

        res.send({ status: "succes", payload: await manager.getProductById(id) })
    } catch (err) {
        res.status(404).send({ status: "error", error: `${err}` })
    }
})

productsRouter.delete("/:pid", async (req, res) => {
    try {
        const { limit, page, sort, title, stock } = req.query
        const query = {title, stock}
        const { pid } = req.params
        await manager.deleteProduct(pid)

        const products = await manager.getProducts(page,limit, sort, query)
        req.io.emit("delete-product", products.docs)

        res.send({ status: "succes", payload: "Producto eliminado" })
    } catch (err) {
        res.status(404).send({ status: "error", error: `${err}` })
    }
})
