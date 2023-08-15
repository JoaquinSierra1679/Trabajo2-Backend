console.log("hola desde profile");

async function becomePremium() {
    let respuesta = await fetch("/api/user/premiumEasy", {
        method: "PUT",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    location.reload();
    alert("Cambiaste tu rol satisfactoriamente")
}