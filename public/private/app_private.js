//client-side socket connection
let socket = io('/private'); //add the /private here for the private namespace

let r;
let g;
let b;

window.addEventListener('load', () => {
    let roomName = window.prompt('Enter room name: ');
    console.log(roomName);

    //send room name to server
    socket.emit('room-name', {room: roomName});
});

socket.on("connect", () => {
    console.log("Connected");
});

//listen for data from server
socket.on("draw-data", (data) => {
    drawObj(data);
});

socket.on("joined", data => {
    console.log(data);
})

function setup(){
    createCanvas(windowWidth, windowHeight);
    background(255);

    r = random(255);
    g = random(255);
    b = random(255);
}

function mouseDragged(){

    //data object
    let dataObj = {
        x: mouseX,
        y: mouseY,
        "red" : r,
        "green" : g,
        "blue" : b
    }

    //emit the data
    socket.emit("data", dataObj); //(event name we are given it, what data we are emitting)

}

function drawObj(data){
    noStroke();
    fill(data.red, data.green, data.blue, 50);
    ellipse(data.x, data.y, 10);
}