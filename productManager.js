const { checkPrimeSync } = require("crypto");
const fs = require("fs");

class ProductManager {
  constructor(archivo) {
    this.archivo = archivo;
  }

  async addProduct(product) {
    try {
      if (this.#paramsValidator(product)) {
        if (!this.#exists(this.archivo)) {
          console.log("Se crea un archivo");
          let productsArray = [];
          product = {
            id: this.#idGenerator(productsArray),
            code: this.#codeGenerator(),
            ...product,
          };
          productsArray.push(product);
          console.log("Agrego producto...");
          await this.#writeFile(this.archivo, productsArray);
          console.log(`Se agrego el producto y su id es: ${product.id}`);
          return product.id;
        } else {
          if (this.#readFile(this.archivo)) {
            console.log("Leyendo archivo...");
            const productsArray = await this.#readFile(this.archivo);
            if (productsArray.length === 0) {
              product = {
                id: this.#idGenerator(),
                code: this.#codeGenerator(),
                ...product,
              };
            } else {
              product = {
                id: this.#idGenerator(productsArray),
                code: this.#codeGenerator(),
                ...product,
              };
            }
            console.log("Agregando producto...");
            productsArray.push(product);
            this.#writeFile(this.archivo, productsArray);
            console.log(`Se agrego el producto con el id: ${product.id}`);
            return product.id;
          }
        }
      }
    } catch (error) {
      console.log(`Error al agregar el producto: ${error.message}`);
    }
  }

  async getAll() {
    try {
      if (this.#exists(this.archivo)) {
        console.log("Leyendo archivo...");
        const productsArray = await this.#readFile(this.archivo);
        if (productsArray.length !== 0) {
          console.log("Archivo con contenido");
          console.log(productsArray);
          return productsArray;
        } else {
          throw new Error(`El archivo ${this.archivo} esta vacio`);
        }
      }
    } catch (error) {
      console.log(`Error obteniendo el stock: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      if (this.#exists(this.archivo)) {
        const productsArray = await this.#readFile(this.archivo);
        const productId = productsArray.find(item => item.id === id);
        if (!productId) {
          throw new Error("No se encontro un producto con el id solicitado");
        } else {
          console.log(`Producto con el id ${id} encontrado:\n`, productId);
          return productId;
        }
      }
    } catch (error) {
      console.log(`Error al buscar producto con el id ${id}: ${error.message}`);
    }
  }

  async updateProduct(id, product) {
    try {
      if (this.#exists(this.archivo)) {
        const productsArray = await this.#readFile(this.archivo);
        const productsIndex = productsArray.findIndex(item => item.id === id);
        if (productsIndex !== -1) {
          const updateProduct = { ...productsArray[productsIndex], ...product };
          productsArray.splice(productsIndex, 1, updateProduct);
          await this.#writeFile(this.archivo, productsArray);
        } else {
          throw new Error(`No se encontro un producto con el id solicitado`);
        }
      }
    } catch (error) {
      console.log(
        `Error al modificar producto con el id ${id}: ${error.message}`
      );
    }
  }

  async deleteById(id) {
    try {
      if (this.#exists(this.archivo)) {
        const productsArray = await this.#readFile(this.archivo);
        console.log(`Buscando producto con id: ${id}`);
        if (productsArray.some(item => item.id === id)) {
          const productsArray = await this.#readFile(this.archivo);
          console.log(`Eliminando producto con id solicitado...`);
          const newProductsArray = productsArray.filter(item => item.id !== id);
          this.#writeFile(this.archivo, newProductsArray);
          console.log(`Producto con el id ${id} eliminado`);
        } else {
          throw new Error(`No se encontro el producto con el id ${id}`);
        }
      }
    } catch (error) {
      console.log(
        `Error al eliminar el producto con el id solicitado: ${error.message}`
      );
    }
  }

  async deleteAll() {
    try {
      if (this.#exists(this.archivo)) {
        let newArray = [];
        console.log("Borrando datos...");
        await this.#writeFile(this.archivo, newArray);
        console.log(`Se borraron todos los datos del archivo ${this.archivo}`);
      } else {
        throw new Error(`El archivo ${this.archivo} no existe`);
      }
    } catch (error) {
      console.log(`Ocurrio un error eliminando los datos: ${error.message}`);
    }
  }

  #codeGenerator(codeLength = 15) {
    const numeros = "0123456789";
    const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numYLetras = numeros + letras;
    let code = "";
    for (let i = 0; i < codeLength; i++) {
      const random = Math.floor(Math.random() * numYLetras.length);
      code += numYLetras.charAt(random);
    }
    return code;
  }

  #idGenerator(productsArray = []) {
    const id =
      productsArray.length === 0
        ? 1
        : productsArray[productsArray.length - 1].id + 1;
    return id;
  }

  #paramsValidator(product) {
    if (
      product.title &&
      product.description &&
      product.price &&
      product.thumbnail &&
      product.stock
    ) {
      return true;
    } else {
      if (!product.title) {
        throw new Error(`Falta el title del producto.`);
      } else if (!product.description) {
        throw new Error(`Falta la descripcion del producto.`);
      } else if (!product.price) {
        throw new Error(`Falta el precio del producto.`);
      } else if (!product.thumbnail) {
        throw new Error(`Falta la imagen del producto.`);
      } else if (!product.stock) {
        throw new Error(`Falta el stock del producto.`);
      }
    }
  }

  #exists(archivo) {
    try {
      if (!fs.existsSync(archivo)) {
        throw new Error("El archivo no existe");
      } else {
        return true;
      }
    } catch (error) {
      console.log(`Error buscando el archivo: ${error.message}`);
    }
  }

  async #readFile(archivo) {
    try {
      const data = await fs.readFileSync(archivo);
      return JSON.parse(data);
    } catch (error) {
      console.log(`Error leyendo el archivo: ${error.message}`);
    }
  }

  async #writeFile(archivo, data) {
    try {
      await fs.writeFileSync(archivo, JSON.stringify(data, null, 2));
    } catch (error) {
      console.log(`Error escribiendo el archivo: ${error.message}`);
    }
  }
}

module.exports = ProductManager;