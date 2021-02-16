import { Injectable } from "@angular/core";
import { Manager } from "socket.io-client";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  socketManager = new Manager("http://localhost:3457/").connect();
  chatMessages = [];

  constructor() {
    // this.initializeChat();
  }

  initializeChat() {
    // this.socketManager.emit("hello", { value: "THE HELLO REQUEST" });
    // new Socket(this.socketManager, '')
  }
}
