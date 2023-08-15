
console.log("update des aqui");

const form = document.getElementById("updateDes");
let category = document.getElementById("valueSelect");
let dataContainer = document.getElementById("dataContainer");
category.addEventListener("change", addPhoto);

function addPhoto() {
  if (category.value === "photos") {
    let inputToRemove = document.getElementById("data");
    dataContainer.removeChild(inputToRemove);
    let inputToAdd = document.createElement("input");
    inputToAdd.type = "file";
    inputToAdd.name = "image";
    inputToAdd.id = "image";
    dataContainer.appendChild(inputToAdd);
    
  } else if (category.value === "stock" || category.value === "price") {
    let imageInput = document.getElementById("image");
    imageInput ? dataContainer.removeChild(imageInput) : null;
    let textInput = document.getElementById("data");
    textInput? dataContainer.removeChild(textInput):null
    let inputToAdd = document.createElement("input");
    inputToAdd.type = "number";
    inputToAdd.name = "data";
    inputToAdd.id = "data";
    dataContainer.appendChild(inputToAdd);
  }else {
    let imageInput = document.getElementById("image");
    imageInput ? dataContainer.removeChild(imageInput) : null;
    let valueToChk = document.getElementById("data");
    valueToChk? dataContainer.removeChild(valueToChk):null;
    let inputToAdd = document.createElement("input");
    inputToAdd.type = "text";
    inputToAdd.name = "data";
    inputToAdd.id = "data";
    dataContainer.appendChild(inputToAdd);
  }
}

form.onsubmit = async (e) => {
  e.preventDefault();
  let formData = new FormData(form);
  let dataToSend = {};
  for (let [key, value] of formData.entries()) {
    dataToSend[key] = value;
  }
  console.log(dataToSend);
  let respuesta = await fetch("/api/designs/", {
    method: "PUT",
    credentials: "include",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status=="success") {
        alert("modificado correctamente")
      } else {
        alert(`no se ha logrado modificar por la siguiente razon:${data.message}`)
      }
    });
};