import { json, Router } from "express";
import { cartManager, manager } from "../app.js";

const cartsRouter = Router()
cartsRouter.use(json())

cartsRouter.post("/", async (req, res) => {
    try {
        await cartManager.addCart()
        res.send({ status: "succes", payload: "Carrito añadido." })
    } catch (err) {
        res.status(404).send({ status: "error", error: `${err}` })
    }
})

cartsRouter.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        let cart = await cartManager.getCartProducts(cid)
        res.send({ status: "succes", payload: cart })
    } catch (err) {
        res.status(404).send({ status: "error", error: `${err}` })
    }
})

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params
        let product = await manager.getProductById(pid)
        await cartManager.addProductToCart(product, cid)
        res.send({ status: "succes", payload: await cartManager.getCartProducts(cartID) })
    } catch (err) {
        res.status(404).send({ status: "error", error: `${err}` })
    }
})

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params
        await cartManager.deleteProductInCart(cid, pid)
        res.send({ status: "succes", payload: "Producto eliminado." })
    } catch (err) {
        res.status(404).send({ status: 'error', error: `${err}` })
    }
})

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body
        await cartManager.moreQuantity(cid, pid, quantity)

        res.send({ status: "succes", payload: "Quantity Updated." })
    } catch (err) {
        res.status(404).send({ status: "error", error: err.message })
    }
})

cartsRouter.delete("/:cid", async (req,res)=>{
    try{
        const {cid} = req.params
        const result = await cartManager.clearCart(cid)
        res.send({status: "succes", payload: result})
    }catch(err){
        res.status(404).send({ status: "error", error: err.message })
    }
})