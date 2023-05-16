//chat
const socket = io();

let userName;

userName = prompt("whats your name?");
if (userName) {
  alert(`Bienvenido al chat ${userName}`);
  socket.emit("new-user", userName);
}else{
  prompt("user is necesary");
};

const chatInput = document.getElementById("chat-input");
chatInput.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") {
    const inputMessage = chatInput.value;
    if (inputMessage) {
      socket.emit("chat-message", {userName, message: inputMessage});
      chatInput.value = "";
    }else{
      alert("input vacio")
    }
  }
});

const messagesPanel = document.getElementById("messages-panel");
socket.on("messages",async (data) => {
  console.log(data);
  let messages = "";

  await data.forEach((m) => {
    messages += `<b>${m.userName}:</b> ${m.message}</br>`;
  });
  messagesPanel.innerHTML = messages;
})

socket.on("new-user", (userName) => {
    alert(`${userName} se ha unido al chat`);
  })