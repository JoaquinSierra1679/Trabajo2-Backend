const socket = io()

const containerProducts = document.getElementById("containerProducts")

socket.on("new-product", (data)=>{
    containerProducts.innerHTML += `
                                    <li>
                                        <p><b>${data.title}</b></p>
                                        <p>Precio: $ ${data.price}</p>
                                        <p>Descripción: ${data.description}</p>
                                        <p>Stock: ${data.stock}</p>
                                        <p>Categoría: ${data.category}</p>
                                    </li>
                                    `
})

socket.on("delete-product", (products)=>{
    containerProducts.innerHTML = ""
    products.forEach( prod => {
        containerProducts.innerHTML += `
                                        <li>
                                            <p><b>${prod.title}</b></p>
                                            <p>Precio: $ ${prod.price}</p>
                                            <p>Descripción: ${prod.description}</p>
                                            <p>Stock: ${prod.stock}</p>
                                            <p>Categoría: ${prod.category}</p>
                                        </li>
                                        `
    }) 
})

socket.on("update-product", (products)=>{
    containerProducts.innerHTML = ""
    products.forEach( prod => {
        containerProducts.innerHTML += `
                                        <li>
                                            <p><b>${prod.title}</b></p>
                                            <p>Precio: $ ${prod.price}</p>
                                            <p>Descripción: ${prod.description}</p>
                                            <p>Stock: ${prod.stock}</p>
                                            <p>Categoría: ${prod.category}</p>
                                        </li>
                                        `
    }) 
})