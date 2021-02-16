import { Component, OnInit } from "@angular/core";
import { ChatService } from "src/app/services/chat.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"],
})
export class ChatPage implements OnInit {
  constructor(public chatService: ChatService) {}

  ngOnInit() {
  }

  ionViewDidEnter() {
    console.log("Entering messenger")
    this.chatService.socketManager.emit("hello", { who: "me?" });
    this.chatService.socketManager.on("userconn", (data) => {
      console.log("Message came", data);
    });
  }
}
