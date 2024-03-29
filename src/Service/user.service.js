//importapp
import jwt from "jsonwebtoken";

//import propio
import UserMongoDao from "../Dao/user.dao.js";
import { createCart, deleteCart } from "./cart.service.js";
import { options } from "../config/config.js";
import { createHash } from "../utils/utils.js";
import { validatePassword } from "../utils/utils.js";
import { logger } from "../utils/logger.js";
import { sendDeletedUser } from "../utils/email.js";

const userManager = new UserMongoDao();

export const signIn = async (first_name, last_name, email, age, password, avatar) => {
  //confirmar que el correo no exista
  const chkEmail = await userManager.getUserByEmail(email);
  if (chkEmail) {
    logger.info("usuario ya registrado");
    return "usuario ya registrado";
  } else {
    //ajustar role
    let role = "user";
    if (email.endsWith("@coder.com")) {
      role = "admin";
    } else {
      role = "user";
    }
    //empaquetar y enviar al manager
    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role,
      cart: await createCart(),
      last_connection: new Date(),
      avatar,
    };
    const userCreated = await userManager.addUser(newUser);

    return userCreated;
  }
};

export const login = async (email, password) => {
  console.log(email);
  const userToLog = await userManager.getUserByEmail(email);
  if (userToLog) {
    if (validatePassword(password, userToLog)) {
      const today = new Date();
      const updateLastConnection = await userManager.updateUserLastConn(userToLog._id, today);
      console.log(updateLastConnection);
      logger.info("si existe el correo");
      return userToLog;
    } else {
      logger.warning("password equivocado");
      return false;
    }
  } else {
    logger.error("no existe el correo");
    return false;
  }
  return userToLog;
};

export const updateLastConnection = async (uId) => {
  const today = new Date();
  return await userManager.updateUserLastConn(uId, today);
};

export const getUserToken = (req, res) => {
  let token = req.cookies[options.server.cookieToken];
  passport.authenticate("jwt", { session: false });
  const info = jwt.verify(token, options.server.secretToken);
  console.log(userData.cart[0]._id);
  return info;
};

export const chkUserMail = async (email) => {
  const userToChk = await userManager.getUserByEmail(email);
  if (!userToChk) {
    logger.warning("No existe el correo");
    return false;
  } else {
    logger.info("si existe el correo");
    return userToChk;
  }
};

export const chkUserId = async (uId) => {
  const userToChk = await userManager.getUser(uId);
  if (!userToChk) {
    logger.warning("no existe el usuario");
    return false;
  } else {
    logger.info("usuario encontrado");
    return userToChk;
  }
};

export const updatePass = async (email, newPassword) => {
  console.log(email);
  const userData = await chkUserMail(email);
  console.log(userData);
  if (userData) {
    const UpdatedUserData = {
      ...userData._doc,
      password: createHash(newPassword),
    };
    const updatedDataToPush = await userManager.updateUserPass(email, UpdatedUserData);
    return updatedDataToPush;
  }
};

export const updateRole = async (uid) => {
  //verificar que el ususario existe
  const userToUpdate = await userManager.getUser(uid);
  const userRole = userToUpdate.role;
  const userDocuments = userToUpdate.documents;
  const chkDocs = userDocuments.filter((docu) => docu.reference == null);
  console.log(chkDocs);
  let response = "";
  if (chkDocs.length >= 1) {
    console.log("problema con docus");
    response = `faltan los documentos`;
    throw new Error("debes tener todos los documentos para realizar esta accion");
  } else {
    response = "todos los documentos cargados";
    if (userRole == "user") {
      console.log("eres user y cambiaras a premium");
      const updateRoleUser = await userManager.updateUserRole(uid, "premium");
      return updateRoleUser;
    } else if (userRole == "premium") {
      console.log("eres premium y cambiaras a user");
      const updateRolePremium = await userManager.updateUserRole(uid, "user");
      return updateRolePremium;
    } else {
      console.log("debes ser admin y no puedes cambiar a premium o user");
    }
    console.log(userRole);
    return userToUpdate;
  }
};

export const easyPremium = async (uid, role) => {
  console.log(role);
  if ((role == "user")) {
    const roleUpdate = await userManager.updateUserRole(uid, "premium");
    return roleUpdate;
  } else {
    const roleUpdate = await userManager.updateUserRole(uid, "user");
    return roleUpdate;
  }
};

export const usersListFiltered = async () => {
  const users = await userManager.getAllUsers();
  const usersFiltered = users.map((user) => {
    return {
      _id: user._id,
      email: user.email,
      name: user.first_name,
      role: user.role,
    };
  });
  console.log(usersFiltered);
  return usersFiltered;
};

export const deleteOldUsers = async () => {
  const users = await userManager.getAllUsers();
  const today = new Date();
  const limitTime = new Date(today.getTime() - (2 * 24 * 60 * 60 * 1000)); //1000ms=1sec*60secs*60mins*24horas*2dias
  console.log(limitTime);
  const filtrarUsuarios = users.filter((user) => user.last_connection >= limitTime);
  console.log(filtrarUsuarios);
  const idsToDelete = await filtrarUsuarios.map((user) => {
    sendDeletedUser(user.email);
    userManager.deleteUser(user._id);
    deleteCart(user.cart);
  });
  console.log(idsToDelete);
  return idsToDelete;
};

export const updateUserDocuService = async (uId, dbKey, dataUpdate) => {
  const response = await userManager.updateUserDocu(uId, dbKey, dataUpdate);
  return response;
};