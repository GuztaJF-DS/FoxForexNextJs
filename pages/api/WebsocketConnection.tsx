import {io} from "socket.io-client";

function WebsocketConnection(){
    const socket=io("http://localhost:8080");

    socket.on("disconnect",()=>{
        console.log("Disconnected");
    });

    socket.on("connect",()=>{
        console.log("connect");
    });

    return(socket);
}

export default WebsocketConnection;