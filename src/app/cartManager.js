import fs from "fs";
import ProductManager from "./productManager.js";

const item = new ProductManager();

class CartManager {
  #path = "./src/server/carts.json";
  idAcum = 0;

  constructor(path) {
    path = this.#path;
  }
  //creamos carrito
  async createCart() {
    let carts = await this.getCarts();
    const newCart = {
      cId: await this.idOrganizer(),
      products: [],
    };
    carts = [...carts, newCart];
    await fs.promises.writeFile(this.#path, JSON.stringify(carts));
  }
  //organizador de ids
  async idOrganizer() {
    const carts = await this.getCarts();
    let chkCartNum = await carts.map((cart) => cart.cId);
    let highId = await Math.max(...chkCartNum);
    if (highId === -Infinity) {
      return 1;
    } else {
      console.log("pasa por adicion");
      return highId + 1;
    }
  }

  async getCarts(cId) {
    try {
      
      if (cId) {
        const cartId = Number(cId);
        const carts = await fs.promises.readFile(this.#path, "utf-8");
        const cartsJson = await JSON.parse(carts);
        const filteredCart = await cartsJson.find(
          (cart) => cart.cId === cartId
        );
        return filteredCart;
      } else {
        const prodsInCart = await fs.promises.readFile(this.#path, "utf-8");
        return JSON.parse(prodsInCart);
      }
    } catch (error) {
      return [];
    }
  }

  async chkCartById(arr, cId) {
    const chkCartId = await arr.some((cart) => cart.cId === cId);
    return chkCartId;
  }

  async addProductToCart(cId, pId) {
    //revisar que el cId exista
    const carts = await this.getCarts();
    const chkcId = await this.chkCartById(carts, cId);
    if (chkcId) {
      const cartToWork = await carts.find((cart) => cart.cId === cId);
      //revisar si el producto ya existe en la lista
      let prodInCart = cartToWork.products.some((p) => p.pId === pId);
      // console.log(cartToWork.quantity=+1);
      if (prodInCart) {
        console.log("si existe el producto");
        let updateQuanti = cartToWork.products.find((p) => p.pId === pId);
        updateQuanti.quantity++
        let updateCarts = await carts.filter((cart) => cart.cId !== cId);
        let updatedCarts = [...updateCarts, cartToWork];
        await fs.promises.writeFile(this.#path, JSON.stringify(updatedCarts));
        return updatedCarts;
      } else {
        console.log("no existe el producto");
        cartToWork.products = [
          ...cartToWork.products,
          { pId: pId, quantity: 1 },
        ];
        let updateCarts = await carts.filter((cart) => cart.cId !== cId);
        let updatedCarts = [...updateCarts, cartToWork];
        await fs.promises.writeFile(this.#path, JSON.stringify(updatedCarts));
        return updatedCarts;
      }
    } else {
      throw new Error (`el carrito con el id ${cId} no existe`);
      return console.log(`el carrito con el id ${cId} no existe`);
    }
  }
}

export default CartManager;