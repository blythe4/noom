const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

room.hidden = true;
let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const rooms = form.querySelector("input#rooms");
    const nickname = form.querySelector("input#name");
    // emit 마지막 agument는 무조건 function 이여야함
    socket.emit("nickname", nickname.value);
    socket.emit("enter_room", rooms.value, showRoom);
    roomName = rooms.value;
    rooms.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
    console.log(user);
    addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
    addMessage(`${left} left ..`);
});

socket.on("new_message", addMessage);
