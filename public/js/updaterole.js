console.log("aqui estoy updaterole");

let form = document.querySelector("form");

form.onsubmit = async (e) => {
  e.preventDefault();
  let formData = new FormData(form);
  let data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  console.log(data);
  let respuesta = await fetch("/api/user/premium", {
    method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data.status);
    });
};