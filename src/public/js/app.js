const messgaeList = document.querySelector("ul");
const messgaeFrom = document.querySelector("form");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
    console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
});

function handleSubmit(event) {
    event.preventDefault();
    const input = messgaeFrom.querySelector("input");
    socket.send(input.value);
    input.value = "";
}

messgaeFrom.addEventListener("submit", handleSubmit);
