console.log('update des aqui');

const form = document.querySelector('form');

form.onsubmit = async(e) => {
    e.preventDefault();
    let formData = new FormData(form);
    let respuesta = await fetch('http://localhost:8080/api/designs', {
        method: "PUT",
        credentials: "include",
        body: formData,
    })
}