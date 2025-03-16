import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port : 8080});

wss.on("connection", function(ws){
    ws.on("message",function(data){
        console.log(data);
    })
    ws.send("Hi there");
})