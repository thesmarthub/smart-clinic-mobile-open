import { Component, OnInit } from "@angular/core";
import { Store } from "src/app/engine/store";
import { ChatService } from "src/app/services/chat.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"],
})
export class ChatPage implements OnInit {
  chatMessage;
  messageList = [];
  store = new Store();
  constructor(public chatService: ChatService) {}

  ngOnInit() {
    this.chatService.actionNotifier.subscribe((action) => {
      if (action === "scroll") {
        console.log("scrolling...")
        const content = document.getElementById("msg");
        content.scrollIntoView(false);
      }
    });
  }

  ionViewDidEnter() {}

  sendMessage() {
    this.chatService.sendMessage(this.chatMessage);
    this.chatMessage = "";
  }
}
