import { json, Router } from "express";
import { cartManager, manager } from "../app.js";

const cartsRouter = Router()
cartsRouter.use(json())

cartsRouter.post("/", async (req,res)=>{
    try{
        await cartManager.addCart()
        res.send({status: "succes", payload: "Carrito añadido."})
    }catch(err){
        res.status(404).send({status: "error", error: `${err}`})
    }
})

cartsRouter.get("/:cid", async (req, res)=>{
    try{
        const {cid} = req.params
        let cart = await cartManager.getCartProducts(parseInt(cid))
        res.send({status: "succes", payload: cart})
    }catch(err){
        res.status(404).send({status: "error", error: `${err}`})
    }
})

cartsRouter.post("/:cid/products/:pid", async (req,res)=>{
    try{
        const {cid, pid} = req.params
        const prodID = parseInt(pid)
        const cartID = parseInt(cid)
        let product = await manager.getProductById(prodID)
        await cartManager.addProductToCart(product, cartID)
        res.send({status: "succes", payload: await cartManager.getCartProducts(cartID)})
    }catch(err){
        res.status(404).send({status: "error", error: `${err}`})
    }
})

cartsRouter.delete("/:cid/products/:pid", async (req, res)=>{
    try{
        const {cid, pid} = req.params
        const prodID = parseInt(pid)
        const cartID = parseInt(cid)
        await cartManager.deleteProductInCart(cartID, prodID)
        res.send({status: "succes", payload: "Producto eliminado."})
    }catch(err){
        res.status(404).send({status: 'error', error: `${err}`})
    }
})

export default cartsRouter