let form = document.querySelector("form");
console.log('aqui estoy login');

form.onsubmit = async (e) => {
  e.preventDefault();
    let formData = new FormData(form);
    let data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
    }
    console.log(data);
  let respuesta = await fetch("http://localhost:8080/api/user/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data.status);
      if (data.status == "success") {
        window.location.href = "http://127.0.0.1:5500/FrontTest/pages/profile.html";
      }
    });
};