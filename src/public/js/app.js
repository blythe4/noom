const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone(msg) {
    console.log(`The backend says : ${msg}`);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    // emit 마지막 agument는 무조건 function 이여야함.
    socket.emit("enter_room", input.value, backendDone);
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
