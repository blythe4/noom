const messageList = document.querySelector("ul");
const messageFrom = document.querySelector("#message");
const nickFrom = document.querySelector("#nick");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMesage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
});

function handleSubmit(event) {
    event.preventDefault();
    const input = messageFrom.querySelector("input");
    socket.send(makeMesage("new_message", input.value));
    input.value = "";
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickFrom.querySelector("input");
    socket.send(makeMesage("nickname", input.value));
    input.value = "";
}
messageFrom.addEventListener("submit", handleSubmit);
nickFrom.addEventListener("submit", handleNickSubmit);
