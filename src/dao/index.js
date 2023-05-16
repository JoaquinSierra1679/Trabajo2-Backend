import fileProductManager from "./file-managers/productManager.js";
import dbProductManager from "./db-managers/productManager.js";
import fileCartManager from "./file-managers/cartManager.js";
import dbCartManager from "./db-managers/cartManager.js";

const config = {
    persistanceType: "db",
};

let ProductManager, CartManager;

if (config.persistanceType === "db"){
    ProductManager = dbProductManager;
    CartManager = dbCartManager;
} else if (config.persistanceType === "file"){
    ProductManager = fileProductManager;
    CartManager = fileCartManager;
} else {
    throw new Error("unknow persistance type");
}

export {ProductManager, CartManager};