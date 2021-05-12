import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "src/app/engine/store";
import { ChatService } from "src/app/services/chat.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"],
})
export class ChatPage implements OnInit {
  chatMessage: string;
  messageList = [];
  store = new Store();
  constructor(public chatService: ChatService, public router: Router) {}

  ngOnInit() {
    this.chatService.actionNotifier.subscribe((action) => {
      if (action === "scroll") {
        console.log("scrolling...");
        const content = document.getElementById("msg");
        content.scrollIntoView(false);
      }
    });
  }

  ionViewDidEnter() {}

  sendMessage() {
    this.chatService.sendMessage(this.chatMessage.trim());
    this.chatMessage = "";
  }

  switchToVideo() {
    this.router.navigateByUrl("/tabs/video-chat");
  }

  endChat() {
    if (!confirm("Are you sure you want to end this chat?")) return;
    this.chatService.endChat();
  }
}
