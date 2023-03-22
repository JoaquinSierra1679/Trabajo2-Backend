import fs from "fs"

class ProductManager{
    
    #path = ""

    constructor(path){
        this.#path = path
    }
    
    async getProducts(){
        try{
            const products = await fs.promises.readFile(this.#path, "utf-8")
            return JSON.parse(products)
        }catch{
            return []
        }
    }

    async getIDs(){
        let products = await this.getProducts()
        // Genero un array con todos los id's.
        let ids = products.map( prods => prods.id)
        // Saco el id mayor y lo retorno.
        let mayorID = Math.max(...ids)
        if (mayorID === -Infinity) {
            return 0
        } else {
            return mayorID
        }
    }
    
    async addProduct(title, description, price, thumbail, code, stock){

        // Al último ID le sumo 1 y se lo asigno a la propiedad id del objeto.
        let mayorID = await this.getIDs()
        
        const product = {
            title,
            description,
            price,
            thumbail,
            code,
            stock,
            id : ++mayorID
        }

        let products = await this.getProducts()
        let verificar = Object.values(product)
        let sameCode = products.find( prod => prod.code === code)

        if (verificar.includes(undefined)){
            throw new Error(`El producto ${product.title} NO ha sido cargado, debe completar todos los datos.`)
        }
        if(sameCode){
            throw new Error(`El producto ${product.title} NO ha sido cargado ya que la propiedad "code" está repetida, ${sameCode.title} tiene el mismo valor.`)
        }
    
        products = [...products, product]
        console.log(`${product.title} cargado correctamente.`)
        await fs.promises.writeFile(this.#path, JSON.stringify(products))
    }

    //Para modificar un producto debemos pasar como primer parámetro el ID, y como segundo parámetro un objeto con las propiedades modificadas.
    async updateProduct(id, propModify){
        let products = await this.getProducts()
        let productModify = products.find(i => i.id === id)

        if (!productModify){
            throw new Error('No se encontró ningún producto con ese ID.')
        }

        // Hago una verificación para que no se pueda cambiar la prop ID de ningún producto
        if (Object.keys(propModify).includes('id')){
            throw new Error('No es posible modificar el ID de un producto.')
        }

        // Hago una verificación para que no se pueda cambiar la propiedad 'code' por una que ya exista.
        if (Object.keys(propModify).includes('code')){
            let sameCode = products.some(i => i.code === propModify.code)
            if (sameCode){
                throw new Error('No es posible modificar la propiedad code por una que ya exista.')
            }
        }
        
        // Modificamos el producto y filtramos un array sin el producto modificado para agreagarlo y que no se repita.
        productModify = {...productModify, ...propModify}
        let newArray = products.filter( prods => prods.id !== id)
        newArray = [...newArray, productModify]
        await fs.promises.writeFile(this.#path, JSON.stringify(newArray))
        console.log('Modificación realizada con éxito.')
    }

    async getProductById(id){
        let products = await this.getProducts()
        let element = products.find(elem => elem.id === id)
        if (element){
            return element
        } else {
            throw new Error('No se encuentra producto con ese ID.')
        }
    }

    async deleteProduct(id){
        let products = await this.getProducts()
        let check = products.some(prod => prod.id === id)
        
        if (!check){
            throw new Error('No existe producto con ese ID.')
        }

        let newArray = products.filter(prods => prods.id !== id)
        await fs.promises.writeFile(this.#path, JSON.stringify(newArray))
        console.log('Producto eliminado con éxito')
    }
}

export default ProductManager