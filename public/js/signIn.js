console.log("aqui estoy signin");
let form = document.querySelector("form");

form.onsubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData(form);
    console.log(formData);
    let respuesta = await fetch("/api/user/signin", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.status);
        if (data.status == "success") {
          window.location.href = "/profile";
        }
      });
    console.log(respuesta);
  };