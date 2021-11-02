//client-side socket connection
let socket = io();

let r;
let g;
let b;

socket.on("connect", () => {
    console.log("Connected");
});

//listen for data from server
socket.on("draw-data", (data) => {
    drawObj(data);
});

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