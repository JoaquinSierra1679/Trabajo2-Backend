import { json, Router } from "express";
import { manager } from "../app.js";

const productsRouter = Router()
productsRouter.use(json())

productsRouter.get("/", async (req, res)=>{
    try{
        const products = await manager.getProducts()
        const {limit} = req.query

        if (limit){
            const productsLimit = products.slice(0,limit)
            return res.send({status: "succes", payload: productsLimit})
        }

        res.send({status: "succes", payload: products})
    } catch (err){
        res.status(404).send({status: "error", error: `${err}`})
    }
})

productsRouter.get("/:pid", async (req, res)=>{
    try{
        const {pid} = req.params
        const product = await manager.getProductById(parseInt(pid))
        res.send({status: "succes", payload: product})
    } catch(err) {
        res.status(404).send({status: "error", error: `${err}`})
    }
})

productsRouter.post("/", async (req,res)=>{
    try{
        // En el body no envío "thumbail" ni "status", los defino por defecto hasta que tenga que cambiarlo
        const {title, description, price, thumbail=[], code, stock, status=true, category} = req.body
        await manager.addProduct(title, description, parseInt(price), thumbail, code, parseInt(stock), status, category)

        res.send({status: "succes", payload: req.body})
    }catch(err){
        res.status(404).send({status: "error", error: `${err}`})
    }
})

productsRouter.put("/:pid", async (req, res)=>{
    try{
        const {pid} = req.params
        const id = parseInt(pid)
        await manager.updateProduct(id, req.body)

        res.send({status: "succes", payload: await manager.getProductById(id)})
    }catch(err){
        res.status(404).send({status: "error", error: `${err}`})
    }
})

productsRouter.delete("/:pid", async(req, res)=>{
    try{
        const {pid} = req.params
        const id = parseInt(pid)
        await manager.deleteProduct(id)

        res.send({status: "succes", payload: "Producto eliminado"})
    } catch(err){
        res.status(404).send({status: "error", error: `${err}`})
    }
})

export default productsRouter