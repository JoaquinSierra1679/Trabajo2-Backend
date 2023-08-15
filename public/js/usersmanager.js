console.log('aqui estoy users manager');

async function deleteUsers(e) {
    let respuesta = await fetch("/api/user/", {
        method: "DELETE",
          credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.status);
          alert(data.status)
        });
}