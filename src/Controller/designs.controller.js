//imports propios
import { getDesigns, addDesignPack, deleteDesign, getDesignById, updateDesign, getDesignsByOwner } from "../Service/designs.service.js";
import { CustomError } from "../Service/Error/customError.service.js";
import { generateDesignsErrorInfo } from "../Service/Error/designsErrorInfo.js";
import { EError } from "../enums/EError.js";
import { getUserToken } from "../Service/user.service.js";
import { logger } from "../utils/logger.js";
import { sendDeleteConfirm } from "../utils/email.js";

export const getAllDesigns = async (req, res) => {
  const results = await getDesigns();
  res.json({ status: "success", payLoad: results });
};

export const getDesignsByOwnerCapture = async (req, res) => {
  const {uId} = req.params
  const result = await getDesignsByOwner(uId)
  res.json({status:"success", payLoad:result})
}

export const getDesignsFiltered = async (req, res) => {
  const { limit, page, sortQ, queryKey, queryParam } = req.params;
  const result = await getDesigns(limit, page, sortQ, queryKey, queryParam);
};

export const getDesignByIdCapture = async (req, res) => {
  const designId = req.params.id;
  const result = await getDesignById(designId);
  res.json({ status: "success", payLoad: result });
};

export const addDesignCapture = async (req, res) => {
  try {
    //captura de data de design
    const { title, code, description, category, price, stock, shops, shopsname } = req.body;
    const imageCatch = req.files['image']?.[0] || null;
    const imageToSend = imageCatch ? imageCatch.filename : "";
    //empaquetar shops
    let shopsPack = [];
    if (!shops || !shopsname) {
      console.log("no llegaron shops");
      shopsPack = [];
    } else {
      shopsPack = shopsname.map((e, index) => {
        var obj = {};
        obj[e] = shops[index];
        return obj;
      })  
    }
    
    console.log(shopsPack);
    //capturar data del user
    const userData = req.user;
    const owner = userData._id;
    //EError
    if (!code || !title || !price || !stock) {
      CustomError.createError({
        name: "design create error",
        cause: generateDesignsErrorInfo(code, title, price, stock),
        message: "Error al crear el diseño",
        errorCode: EError.INVALID_PARAMS,
      });
    }
    //envio
    const result = await addDesignPack(code, title, description, category, price, stock, shopsPack, imageToSend, owner);
    res.json({ status: "success", payLoad: result });
  } catch (error) {
    res.status(404).send({ error: `error desde controller${error}` });
  }
};

export const updateDesignCapture = async (req, res) => {
  try {
    const { desId, value, data } = req.body
    const user = req.user;
    let imageCatch = req.files['image']?.[0] || null;
    let imageToSend = imageCatch ? imageCatch.filename : "";
    let dataToSend = data;
    //se revisa si se esta enviando una foto o un dato
    if (value === "photos") {
      dataToSend = imageToSend
    };
    if (value === "stock" || value=== "price") {
      dataToSend = Number(dataToSend)
    }
    console.log(dataToSend);
    //se revisa si es premium para limitar
    if (user.role === "premium") {
      const userId = user._id;
      const designToChk = await getDesignById(desId);
      const chkDesignOwner = designToChk.owner;
      if (chkDesignOwner == userId) {
        const result = await updateDesign(desId, value, dataToSend);
        res.json({ status: "success", payLoad: result });
      } else {
        console.log("no se puede actualizar porque no te pertenece este diseño");
        res.json({ status: "Failed", message: "no se puede actualizar porque no te pertenece este diseño" });
      }
    } else {
      const result = await updateDesign(desId, value, data);
      res.json({ status: "success", payLoad: result });
    }
  } catch (error) {
    res.status(404).send({ error: `error desde controller ${error}` });
  }
};

export const deleteDesignCapture = async (req, res) => {
  try {
    //captura de datos
    const user = req.user;
    const {designId} = req.body;
    req.logger.warning(`diseño a borrar${designId}`);
    //filtrar si el dueño es premium a partir de su propiedad 64925e5e4b9b5074d4c8b183
    if (user.role === "premium") {
      const userId = user._id;
      const designToChk = await getDesignById(designId);
      const chkDesignOwner = designToChk.owner;
      console.log(chkDesignOwner);
      if (chkDesignOwner == userId) {
        console.log("se borra");
        const result = await deleteDesign(designId, userId);
        await sendDeleteConfirm(user.email, designId);
        res.json({ status: "success", payLoad: result });
      } else {
        console.log("no se puede borrar porque no te pertenece este diseño");
        res.json({ status: "Failed", message: "no se puede borrar porque no te pertenece este diseño" });
      }
    } else {
      //envio
      const result = await deleteDesign(designId);
      res.json({ status: "success", payLoad: result });
    }
  } catch (error) {
    res.status(404).send({ error: "error desde controller" });
  }
};

export const getDesignsLive = async (req, res) => {
  io.emit(`event`, { for: `everyone` });
  res.send(`hello world`);
};