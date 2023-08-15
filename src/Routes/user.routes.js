import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { changeRoleCapture, deleteOldUsersCapture, documents, forgotPassCapture, listUsers, loginCapture, logoutCapture, picTest, profileCall, resetPasswordCapture, rolePremiumEasy, signInCapture } from "../Controller/user.controller.js";
import { uploaderDocuments, uploaderProfile } from "../utils/multer.js";
import { authorize } from "../middlewares/authorize.js";

const userRouter = Router();

//rutas users
userRouter.post("/signin", uploaderProfile.fields([{name: "avatar",maxCount:1}]) ,signInCapture);
userRouter.post("/login", loginCapture);
userRouter.get("/profile",authenticate("authJWT"), profileCall);
userRouter.post("/logout",authenticate("authJWT"), logoutCapture);
userRouter.post("/forgot-password", forgotPassCapture);
userRouter.post("/reset-password", resetPasswordCapture);
userRouter.put("/premium", authenticate("authJWT"), authorize('admin'), changeRoleCapture);
userRouter.put("/premiumEasy", authenticate("authJWT"),rolePremiumEasy);
userRouter.post("/:uid/documents", uploaderDocuments.fields([{ name: "identificacion", maxCount: 1 }, { name: "domicilio", maxCount: 1 }, { name: "estadoDeCuenta", maxCount: 1 }]), documents);
userRouter.get("/", listUsers);
userRouter.delete("/", deleteOldUsersCapture);
//ruta test
userRouter.post("/pic", uploaderProfile.fields([{name: "avatar",maxCount:1}]), picTest);

export{userRouter};