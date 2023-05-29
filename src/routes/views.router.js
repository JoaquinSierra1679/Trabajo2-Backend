import { Router, json } from "express";
import {CartManager, ProductManager} from "../dao/index.js";
import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";
import mongoose from "mongoose";

const item = new ProductManager();
const cart = new CartManager();

const viewer = Router();
//login
viewer.get("/login",(req,res) =>{
    res.render("login");
})
//signup
viewer.get("/register",(req,res) =>{
    res.render("register");
})
//profile
viewer.get("/profile", (req,res) =>{
    let userData= req.session;
    console.log(userData);
    res.render("profile", {userData});
})
//home
viewer.get("/", async (req,res) =>{
    const prods = await productModel.paginate();
    console.log(prods);
    res.render("index", {prods});
})
//todos los productos
viewer.get("/products", authenticate, async (req,res) =>{
    console.log(`esto se ve desde prods${req.session.username}`);
    const {page} =req.query;
    const prods = await  productModel.paginate(
        {},{limit: 10, lean:true, page: page??1}
    );
    const userData = req.session.username;
    res.render("products", {prods, userData});
})
//middle se aut
async function authenticate(req, res, next) {
    console.log(`esto se ve desde midd ${req.session}`);
    if (req.session.rol === "admin") {
        return next();
      }else{
        res.send(`${req.session.username} no tienes acceso, esta es un area solo para admin`);
      }
  }

//info del producto preciso
viewer.get("/products/productDetail", async (req,res) =>{
    const {pId} = req.query;
    console.log(pId);
    const detailData = await item.getProductById(pId);
    console.log(detailData);
    res.render("productDetail", {detailData})
})
//info carrito
viewer.get("/cart/:cId", async(req,res) => {
    const {cId} = req.params;
    const detailCart = await cart.getCarts(cId);
    console.log(detailCart);
    res.render("cart", {detailCart});
})
//realtime
viewer.get('/real-time-products', (req, res) => {
    res.render('real_time_products');
});
//chat
viewer.get(`/chat`, (req,res) => {
    res.render(`chat`);
})




export default viewer;