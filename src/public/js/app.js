const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConeection;

async function getCamers() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === "videoinput");
        const currentVamera = myStream.getVideoTracks()[0];
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if (currentVamera.label === camera.label) {
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        });
    } catch (e) {
        console.log(e);
    }
}

async function getMedia(deviceId) {
    const initialConstrains = {
        audio: true,
        video: { facingMode: "user" },
    };
    const cameraConstains = {
        audio: true,
        video: { devicedId: { exact: deviceId } },
    };
    try {
        myStream = await navigator.mediaDevices.getUserMedia(deviceId ? cameraConstains : initialConstrains);
        myFace.srcObject = myStream;
        if (!deviceId) {
            await getCamers();
        }
    } catch (e) {
        console.log(e);
    }
}

function handleMuteClick() {
    myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    if (!muted) {
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "Mute";
        muted = false;
    }
}

function handleCameraClick() {
    myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    if (cameraOff) {
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

async function handleCameraChange() {
    await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);

// Welcome Form (join a room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

async function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    await initCall();
    socket.emit("join_room", input.value);
    roomName = input.value;
    input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

//Socket Code
/** 1. A */
socket.on("welcome", async () => {
    const offer = await myPeerConeection.createOffer();
    myPeerConeection.setLocalDescription(offer);
    console.log("sent the offer");
    socket.emit("offer", offer, roomName);
});

/** 2. B */
socket.on("offer", async (offer) => {
    console.log("received the offer");
    myPeerConeection.setRemoteDescription(offer);
    const answer = await myPeerConeection.createAnswer();
    myPeerConeection.setLocalDescription(answer);
    console.log("sent the answer");
    socket.emit("answer", answer, roomName);
});

/** 3. A */
socket.on("answer", (answer) => {
    console.log("received the answer");
    myPeerConeection.setRemoteDescription(answer);
});

/** 5. received candidate */
socket.on("ice", (ice) => {
    console.log("received candidate");
    myPeerConeection.addIceCandidate(ice);
});

// RTC Code
function makeConnection() {
    myPeerConeection = new RTCPeerConnection();
    myPeerConeection.addEventListener("icecandidate", handleIce);
    myPeerConeection.addEventListener("addstream", handleAddStream);
    myStream.getTracks().forEach((track) => myPeerConeection.addTrack(track, myStream));
}

/** 4. sent icecandidate  */
function handleIce(data) {
    console.log("sent candidate");
    socket.emit("ice", data.candidate, roomName);
}

/** 6. peer to peer Stream */
function handleAddStream(data) {
    console.log("got an event from my peer");
    const peerFace = document.getElementById("peerFace");
    peersStream.srcObject = data.stream;
}
