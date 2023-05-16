const socket = io();

socket.on("productList", (data) =>{
    console.log(data);
})

const productData = document.getElementById("prodsList-dysplay");
socket.on("productList", async (data) => {
  console.log(data);
  let prodsList = "";
  await data.forEach((e) => {
    console.log(data.e);
    prodsList += `<ul>
        
            <li>Titulo:${e.title}, Id:${e.id}, Precio${e.price}, Stock:${e.stock}</li>
    
    </ul>`;
  });
  productData.innerHTML = prodsList;
});

