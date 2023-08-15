import { Router } from "express";
import {
  deleteDesign,
  forgotPassword,
  renderAddDesign,
  renderCart,
  renderChat,
  renderDesigns,
  renderIndex,
  renderLogin,
  renderMyShop,
  renderProfile,
  renderSignin,
  resetPass,
  updateDesignText,
  updateRole,
  usersManager,
} from "../Controller/web.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const webRouter = Router();

webRouter.get("/", renderIndex);
webRouter.get("/signin", renderSignin);
webRouter.get("/login", renderLogin);
webRouter.get("/profile", renderProfile);
webRouter.get("/designs",authenticate("authJWT"), renderDesigns);
webRouter.get("/cart", authenticate("authJWT"),renderCart);
webRouter.get("/designs/:pid");
webRouter.get("/cart/:cid");
webRouter.get("/chat", authenticate("authJWT"), authorize("user"), renderChat);
webRouter.get("/addDesign", authenticate("authJWT"), authorize(["admin", "premium"]), renderAddDesign);
webRouter.get("/purchase");
webRouter.get("/forgot-password", forgotPassword);
webRouter.get("/reset-password", resetPass);
webRouter.get("/roleUpdate", updateRole);
webRouter.get("/updateDesign", updateDesignText);
webRouter.get("/deleteDes", deleteDesign);
webRouter.get("/myshop/:uId", renderMyShop);
webRouter.get("/usersManager", usersManager);

//rutas vistas autenticacion

export { webRouter };