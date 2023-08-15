//imports de app
import { Router } from "express";
//imports propios
import { addDesignCapture, deleteDesignCapture, getAllDesigns, getDesignByIdCapture, getDesignsByOwnerCapture, getDesignsFiltered, getDesignsLive, updateDesignCapture } from "../Controller/designs.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { uploaderDesigns } from "../utils/multer.js";

const designsRouter = Router();

//rutas designs
designsRouter.get("/",getAllDesigns);
designsRouter.get("/filtered", getDesignsFiltered);
designsRouter.get("/:id", getDesignByIdCapture);
designsRouter.post("/",authenticate("authJWT"),authorize(["admin", "premium"]), uploaderDesigns.fields([{name:'image', maxCount:1}]) ,addDesignCapture);
designsRouter.put("/",authenticate("authJWT"), authorize(["admin", "premium"]),uploaderDesigns.fields([{name:'image', maxCount:1}]), updateDesignCapture);
designsRouter.delete("/",authenticate("authJWT"), authorize(["admin", "premium"]), deleteDesignCapture);
designsRouter.get("/filtered/live", getDesignsLive);
designsRouter.get("/myshop/:uId", getDesignsByOwnerCapture);

export {designsRouter};