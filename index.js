//express
let express = require("express");
let app = express();
app.use("/", express.static("public"));

//server
let http = require("http");
let server = http.createServer(app);
let port = process.env.PORT || 3000; //use port available or local 3000
server.listen(port, () => {
    console.log("Server is listening at: " + port);
});

//socket connection
let io = require("socket.io");
io = new io.Server(server);

io.sockets.on("connection", (socket) => {
    console.log("We have a new client: " + socket.id);

    socket.on("disconnect", ()=> {
        console.log("Client disconnected: " + socket.id);
    });

    //listen for data
    socket.on("data", (data) => {

        //send to all clients, including myself
        io.sockets.emit("draw-data", data);

        //send to all clients, except me
        socket.broadcast.emit('draw-data', data);

        //send the data to just this client
        socket.emit('data', data);

    });
});

//private namespace connection
let private = io.of('/private');

private.on("connection", (socket) => { //update io.sockets.on --> private.on
    console.log("We have a new client: " + socket.id);

    //listen for room name
    socket.on("room-name", data => {

        //add socket to that room
        socket.join(data.room);

        //add room property to socket object
        socket.room = data.room; //socket.room is a property of the socket object

        let welcomeMsg = "Welcome to " + data.room + " Room";

        //send welcome message to everyone in a room
        private.to(socket.room).emit('joined', {msg: "Welcome a new user."});

        //send welcome message to just this user
        socket.emit("joined", {msg: welcomeMsg});
    });

    socket.on("disconnect", ()=> {
        console.log("Client disconnected: " + socket.id);
        socket.leave(socket.room);
        console.log(`Client ${socket.id} disconnected and left room ${socket.room}`);
    });

    //listen for data
    socket.on("data", (data) => {

        // //send to all clients, including myself
        // private.emit("draw-data", data); //io.sockets.emit --> private.emit

        private.to(socket.room).emit('draw-data', data);

    });
});