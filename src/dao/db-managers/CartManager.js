import cartModel from "../models/carts.model.js";
import productModel from "../models/products.model.js";
import ProductManager from "./productManager.js";

const item = new ProductManager();

class CartManager {
    idAcum = 0;

    constructor() {}
  //creamos carrito
  async createCart() {
    const newCart = {
      products: [],
    };
    const result = await cartModel.create(newCart);
    return result;
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
        const cartsfiltered = await cartModel
          .find({ _id: `${cId}` })
          .populate("products.product").lean();
        return cartsfiltered;
      } else {
        const prodsInCart = await cartModel.find().lean();
        return prodsInCart;
      }
    } catch (error) {
      return [];
    }
  }

  async addProductToCart3(cartId, productId, quanty) {
    try {
      const findProduct = await cartModel
        .findById(cartId)
        .populate("products.product");

        const existingProductIndex = findProduct.products.findIndex(
            (p) => p.product._id.toString() === productId
          );
          let quantyToAdd = quanty ? quanty : 1;
          if (existingProductIndex !== -1) {
            findProduct.products[existingProductIndex].quantity += Number(quantyToAdd);
          } else {
            findProduct.products.push({ product: productId, quantity: quantyToAdd });
          }

          return await findProduct.save();
        } catch (err) {
          throw new Error(err);
        }
      }
      //intento modificacion directa por mongo FALLA
      // async addProductToCart2(cId, pId, quanty) {
      //   try {
      //     //revisar que el cId exista
      //     const cart = await cartModel.findById(cId);
      //     if (cart) {
      //       //revisar que el producto si existe
      //       const prodToAdd = await item.getProductById(pId);
      //       if (prodToAdd) {
      //         //revisar si existe el prod en el carrito
      //         let isInCart = await cartModel.exists({
      //           _id: cId,
      //           "products.product": pId,
      //         });
      //         let quantyToAdd = quanty ? quanty : 1;
      //         if (isInCart === null) {
      //           console.log("prod NO ESTA EN EL CARRITO");
      //           let updateCart = await cartModel.updateOne(
      //             { _id: cId },
      //             { $push: { products: { product: pId, quantity: quantyToAdd } } }
      //           );
      //           const cartupdated = await cartModel.findById(cId);
      //           console.log(cartupdated);
      //           return updateCart, cartupdated;
      //         } else {
      //           console.log("prod si esta en el carrito");
      //           let updateProdInCart = await cartModel.updateOne(
      //             { _id: cId, "products.product": pId },
      //             { $set: { products: { product: pId, quantity: quantyToAdd } } }
      //           );
      //           const cartupdated = await cartModel.findById(cId);
      //           console.log(cartupdated);
      //           return updateProdInCart, cartupdated;
      //         }
      //       } else {
      //         return "no existe el producto";
      //       }
      //     } else {
      //       return "no existe el carrito";
      //     }
      //   } catch (error) {}
      // }

      async addProductArray(cId, arr) {
        try {
          console.log(cId);
          if (!cId || !arr) {
            console.log("falta info");
            return "falta info";
          } else {
            console.log(arr);

            let test = await this.getCarts(cId);
            console.log(test);
            let addArr = await cartModel.updateOne(
              { _id: cId },
              { $push: { products: { $each: arr } } }
            );
            console.log(addArr);
            return addArr;
          }
        } catch (error) {
          return "error en upppadad";
        }
      }

      async clearCart(cId) {
        let cartToClear = await cartModel.updateOne(
          { _id: cId },
          { $pull: { products: {} } }
        );
        return cartToClear;
      }

      async deleteProd(cId, pId) {
        if (!cId || !pId) {
          console.log("falta Información");
        } else {
          let prodDeleted = await cartModel.updateOne(
            { _id: cId },
            { $pull: { products: { product: pId } } }
          );
          return prodDeleted;
        }
      }
    }

    export default CartManager;