import cartModel from "../models/cart.model.js"

export default class CartManager {
    constructor() {
        console.log("Working with DB system.")
    }

    async getCarts() {
        try {
            const carts = await cartModel.find().lean()
            return carts
        } catch (err) {
            console.log(err.message)
            return []
        }
    }

    async addCart() {
        try {
            const cart = {
                products: []
            }
            const result = await cartModel.create(cart)
            return result
        } catch (err) {
            throw new Error(err)
        }
    }

    async getCartProducts(id) {
        try {
            const cart = await cartModel.findById(id).populate("products.product")
            return cart
        } catch (err) {
            throw new Error(err)
        }
    }

    async addProductToCart(prod, cartID) {
        try {
            const cart = await cartModel.findById(cartID)
            const productInCart = cart.products.find(elem => elem.product.toString() === prod._id.toString())

            if (productInCart) {
                productInCart.quantity += 1
                await cart.save()
                await cart.populate("products.product")
                console.log(JSON.stringify(cart, null, "\t"))
            } else {
                cart.products.push({ product: prod._id })
                await cart.save()
                await cart.populate("products.product")
                console.log(JSON.stringify(cart, null, "\t"))
            }
        } catch (err) {
            throw new Error(err)
        }
    }

    async deleteProductInCart(cartID, productID) {
        try {
            const cart = await cartModel.findById(cartID)
            const product = cart.products.find(elem => elem.product.toString() === productID)
            console.log(product)

            if (!product) {
                throw new Error("No existe producto con ese ID")
            }

            if (product.quantity > 1) {
                product.quantity -= 1
                cart.save()
            } else {
                let newCartProducts = cart.products.filter((p) => p.product.toString() !== productID)
                cart.products = newCartProducts
                cart.save()
            }

            console.log(cart)

        } catch (err) {
            throw new Error(err)
        }
    }

    async moreQuantity(cartID, productID, quantity) {
        try {
            const cart = await cartModel.findById(cartID)
            const product = cart.products.find(elem => elem.product.toString() === productID)

            if (!cart) {
                throw new Error("No existe carrito con ese id.")
            }

            if (product) {
                product.quantity += quantity
                await cart.save()
                await cart.populate("products.product")
                console.log(JSON.stringify(cart, null, "\t"))
            } else {
                cart.products.push({ product: productID })
                await cart.save()
                const newProduct = cart.products.find(elem => elem.product.toString() === productID)
                newProduct.quantity = quantity
                await cart.save()
                await cart.populate("products.product")
                console.log(JSON.stringify(cart, null, "\t"))
            }
        } catch (err) {
            throw new Error(err)
        }
    }

    async clearCart(cid) {
        try {
            const cart = await cartModel.findById(cid)
            cart.products = []
            cart.save()
            return cart
        } catch (err) {
            throw new Error(err)
        }
    }
}