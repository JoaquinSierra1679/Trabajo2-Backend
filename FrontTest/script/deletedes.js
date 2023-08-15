console.log('aqui estoy delete');

let form = document.querySelector('form');

form.onsubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData(form);
    let respuesta = await fetch('http://localhost:8080/api/designs/', {
        method: "DELETE",
        credentials: 'include',
        body: formData
    })
        .then((res) => res.json())
        .then((data) => {
        console.log(data);
    })
}