let form = document.querySelector("form");

form.onsubmit = async (e) => {
  e.preventDefault();
  let formData = new FormData(form);
  console.log(formData);
  let respuesta = await fetch("http://localhost:8080/api/user/signin", {
    method: "POST",
    credentials: "include",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data.status);
      if (data.status == "success") {
        window.location.href = "http://127.0.0.1:5500/FrontTest/pages/profile.html";
      }
    });
  console.log(respuesta);
};