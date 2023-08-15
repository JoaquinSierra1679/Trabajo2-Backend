console.log("add design aqui estoy");

//agregar campo shop
let countShops = 0;
let shops = [];
function addShop() {
  console.log("agregando");
  countShops++;
  console.log(countShops);
  let form = document.getElementById("shops");
  let labelToAdd = document.createElement("label");
  labelToAdd.htmlFor = "shop " + countShops;
  labelToAdd.innerHTML = "shop " + countShops + "url";
  let inputToAdd = document.createElement("input");
  inputToAdd.type = "text";
  inputToAdd.name = "shops[]";
  inputToAdd.placeholder='shop URL'
  let space = document.createElement("br");
  let shopNameToAdd = document.createElement("input");
  shopNameToAdd.type = 'text';
  shopNameToAdd.name = 'shopsname[]'
  shopNameToAdd.placeholder='shop name'
  form.appendChild(labelToAdd);
  form.appendChild(shopNameToAdd);
  form.appendChild(inputToAdd);
  form.appendChild(space);
}

//captura de form

let form = document.querySelector("form");

form.onsubmit = async (e) => {
  e.preventDefault();
  let formData = new FormData(form);
  let respuesta = await fetch("http://localhost:8080/api/designs/", {
    method: "POST",
    credentials: "include",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
};