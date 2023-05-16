import cartModel from "../models/carts.model.js";
import productModel from "../models/products.model.js";

class ProductManager {
    idAcum = 0;
    constructor() {}

    async idOrganizer() {
        const products = await this.getProducts();
        let chkIdNum = await products.map((prods) => prods.id);
        let highId = await Math.max(...chkIdNum);
        console.log(highId);
        if (highId === -Infinity) {
          this.idAcum = 0;
          return this.idAcum;
        } else {
          console.log("pasa por adicion");
          return highId + 1;
        }
      }

      async getProducts(limit, page, sortQ, queryKey, queryParam) {
        //filters
        let limitIn = limit ? limit : 10;
        let pageIn = page ? page : 1;
        let sortIn = sortQ ? { price: sortQ } : false;
        let queryKeyIn = queryKey;
        let queryIn = queryParam;
        //paquete options
        let options = { limit: limitIn, page: pageIn, sort: sortIn };
        //paquete query
        let querySearch;
        if (queryKeyIn && queryIn) {
          querySearch = { [queryKeyIn]: [queryIn] };
          options.limit = 5;
        } else {
          {}
        }

        try {
            const products = await productModel.paginate(querySearch, options);
            return products;
          } catch (error) {
            return "falla con mongo";
          }
        }

        async chkProdsById(id) {
            let check = await productModel.findById(id).lean();
            return check;
          }

          async chkProdsByCode(arr, code) {
            let check = await arr.some((prod) => prod.code === code);
            return check;
          }

          async addProduct(
            code,
            title,
            description,
            price,
            thumbnail,
            stock,
            status,
            category
          ) {
            //revisar que si esten todos los datos
            if (code && title && description && price && stock && category) {
              console.log("info completa gracias");
            } else {
              console.log(
                `falta informacion para este item, 
                  recuerde agregar todos los campos:
                  code || title || description || price || thumbnail || stock`
              );
            }
            //revisar que no existe codigo
            let products = await this.getProducts(1, 1, false, "code", code);
            if (products.totalDocs === 0) {
              console.log(`no existe codigo: ${code} ===> SE CREARA NUEVO PRODUCTO`);
              const product = {
                code,
                title,
                description,
                price,
                thumbnail,
                stock,
                status,
                category,
              };
              const result = await productModel.create(product);
              return result;
            } else {
              console.log(`Ya existe el codigo ${code} y NO SE CREARA PRODUCTO`);
              return `Ya existe el codigo ${code} y NO SE CREARA PRODUCTO`;
            }
          }

          async getProductById(id) {
            const chkProductId = await this.chkProdsById(id);
            if (chkProductId) {
              console.log(
                `producto con el id ${id} encontrado, se mostrara a continuacion`
              );
              return chkProductId;
            } else {
              console.log(`el id ${id} solicitado no existe`);
              return `el id ${id} solicitado no existe`;
            }
          }

          async getProductByCode(code) {
            const products = await this.getProducts();
            const chkProductId = await this.chkProdsById(products, code);
            if (chkProductId) {
              const codeFound = await products.find((prod) => prod.code === code);
              console.log(
                `producto con el id ${code} encontrado, se mostrara a continuacion`
              );
              console.log(codeFound);
              return codeFound;
            } else {
              console.log(`el codigo ${code} solicitado no existe`);
            }
          }

          async deleteProdById(id) {
            try {
              let del = await productModel.deleteOne({ _id: `${id}` });
              return del;
            } catch (error) {
              console.log("error al borrar");
              return error;
            }
        }

        async updateProdById(id, keyToUpdate, dataUpdate) {
          if (!id || !keyToUpdate || !dataUpdate) {
            console.log("falta Información");
          } else {
            let update = await productModel.updateOne({ _id: id }, [
              { $set: { [keyToUpdate]: `${dataUpdate}` } },
            ]);
            return update;
          }
        }
      }
      
      export default ProductManager;