

function makeRequest() {
  console.log("entro");
  fetch("/test")
  .then((res) => res.json())
  .then((data) => console.log(data));
}

function getDesigns(){
  fetch("/api/designs")
  .then((res) => res.json())
  .then((data) => console.log(data.payLoad));
}

function logout(){
  const logout = fetch("/api/user/logout",{method:"post"})
  .then((res) => res.json())
  .then((data) => console.log(data.payLoad));
  return logout
}

async function getProfile(){
  const profile = await fetch("/api/user/profile")
  .then((res) => res.json())
      .then((data) => data.payLoad);
  return profile
}

async function addDesignToCart (desId) {
  let user = await getProfile();
  console.log(user);
  let cart = user.cart[0]._id
  console.log(cart); 
  const pushToCart = await addToCart(cart,desId)
  return pushToCart
}

async function addToCart (cart,desId){
  const pushToCart = await fetch(`/api/cart/${cart}/design/${desId}`, {method:"put"})
  .then((res) => res.json())
  .then((data) => data);
  console.log(pushToCart);
  if (pushToCart.status=="success") {
      alert("se ha agregado correctamente al carrito");
  } else if (pushToCart.status === "failed") {
      alert(`ha fallado el agregar el diseño, por la siguiente razon: ${pushToCart.payLoad}`)
  }
}

async function purchaseCart (cart){
  const purchase = await fetch(`/api/cart/${cart}/purchase`, {method:"POST", credentials:"include"})
  .then((res) => res.json())
      .then((data) => data);
  console.log(purchase);
  if (purchase.status) {
      alert("aqui saldria el metodo de pago")
  }
}

async function clearCart(cart) {
  const clear = await fetch(`/api/cart/clear/${cart}`, {method:"Delete", credentials:"include"})
  .then((res) => res.json())
      .then((data) => data);
  console.log(clear);
  if (clear.status == "success") {
      alert("carrito limpio")
  }
}

// Handlebars.registerHelper('if_eq', function(a, b, opts) {
//     if (a == b) {
//         return opts.fn(this);
//     } else {
//         return opts.inverse(this);
//     }
//   });