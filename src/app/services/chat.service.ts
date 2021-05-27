import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Client, StompSubscription } from "@stomp/stompjs";
import { Subject } from "rxjs";
import { Manager } from "socket.io-client";
import { Store } from "../engine/store";
import { ChatMessage } from "../models/chat-message";
import { ChatRequest } from "../models/chat-request";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  // socketManager = new Manager("http://localhost:8080/").connect();
  chatMessages: ChatMessage[] = [];
  store = new Store();
  socket: Client = new Client({
    brokerURL: "wss://events.autoserver.smartapps.com.ng/chat",
    // brokerURL: "ws://localhost:8080/chat",
  });
  socketSubs: StompSubscription[] = [];
  actionNotifier: Subject<any> = new Subject();
  isInitialized = false;
  get activeChatKey() {
    return localStorage.getItem("ack");
  }

  set activeChatKey(key: string) {
    localStorage.setItem("ack", key);
  }

  get activeReceiver() {
    return localStorage.getItem("arID");
  }

  set activeReceiver(arID) {
    localStorage.setItem("arID", arID);
  }

  get activeReceiverName() {
    return localStorage.getItem("arName");
  }

  set activeReceiverName(arName) {
    localStorage.setItem("arName", arName);
  }

  get videoAccessKey() {
    return localStorage.getItem("vKey");
  }

  set videoAccessKey(vKey) {
    localStorage.setItem("vKey", vKey);
  }

  constructor(private _http: HttpClient, private router: Router) {
    this.initialize();
  }

  initialize() {
    if (this.store.user?._id && !this.isInitialized) {
      this.isInitialized = true;
      this.generateChatKey();
      this.socket.onConnect = this.onSocketConnect;
      this.socket.activate();
    }
  }

  onSocketConnect = (frame) => {
    console.log("registering on connects");
    this.chatRequestListener(true);
  };

  createSocketSub(topic, callback) {
    const sub = this.socket.subscribe(topic, callback);
    this.socketSubs.push(sub);
  }

  checkKeyExists() {
    if (this.activeChatKey) {
      const conf = confirm(
        "You have a chat in progress. Do you want to end it?"
      );
      if (!conf) {
        return;
      }
    }
  }

  generateChatKey(force = false) {
    if (force) {
      this.activeChatKey = this.randomId();
      return;
    }
  }

  sendMessage(message: string) {
    const chatMessage = new ChatMessage(
      this.store.userFullName,
      "",
      this.activeReceiver,
      message,
      this.activeChatKey,
      this.store.user.smart_code,
      new Date()
    );
    this.chatMessages.push(chatMessage);
    this.actionNotifier.next("scroll");
    this.socket.publish({
      destination: "/app/new-chat-message",
      body: JSON.stringify(chatMessage),
    });
  }

  receiveMessage = (message) => {
    console.log("Message received", message.body);
    this.chatMessages.push(JSON.parse(message.body));
    this.actionNotifier.next("scroll");
  };

  sendRequest(receiverId: string) {
    console.log(this.socket.connected, "socket status");
    if (!this.socket.connected) {
      alert(
        `Chat feature is temporaily unavailable.
        \nPlease check your internet connection.`
      );
      return;
    }
    this.activeChatKey = this.randomId();
    const chatRequest = new ChatRequest(
      this.store.user._id,
      receiverId,
      this.activeChatKey,
      `${this.store.userFullName} wants to chat.`,
      this.store.user.smart_code,
      new Date()
    );
    this.chatRequestListener();
    this.socket.publish({
      destination: "/app/make-chat-request",
      body: JSON.stringify(chatRequest),
    });
  }

  endChat() {
    this.socketSubs.forEach((sub) => sub.unsubscribe());
    this.router.navigateByUrl("/tabs/doctors");
  }

  chatRequestListener(resumePrev = false) {
    // Remove auto video key reqyest
    this.requestForVideoKey();
    const acceptedChat = `/topic/accepted-chat-request/${this.store.user._id}/${this.activeChatKey}`;
    const cancelledChat = `/topic/cancelled-chat-request/${this.store.user._id}/${this.activeChatKey}`;
    const endedChat = `/topic/ended-chat/${this.store.user._id}/${this.activeChatKey}`;
    const newChatMessage = `/topic/new-chat-message/${this.store.user._id}/${this.activeChatKey}`;
    const newVideoKey = `/topic/new-video-key/${this.store.user._id}`;

    if (!this.activeChatKey) {
      return;
    }
    if (resumePrev) {
      this.createSocketSub(newChatMessage, this.receiveMessage);
    }
    this.createSocketSub(acceptedChat, (message) => {
      console.log(message);
      alert("Chat request has been accepted!");
      this.activeReceiver = JSON.parse(message.body).senderId;
      this.createSocketSub(newChatMessage, this.receiveMessage);
      this.router.navigateByUrl("/tabs/chat");
    });
    this.createSocketSub(cancelledChat, (message) => {
      alert("Doctor is not available!");
      this.socketSubs.forEach((sub) => sub.unsubscribe());
    });
    this.createSocketSub(endedChat, (message) => {
      alert("Chat has been ended.");
      this.socketSubs.forEach((sub) => sub.unsubscribe());
    });
    this.createSocketSub(newVideoKey, (message) => {
      this.videoAccessKey = message.body;
    });
  }

  requestForVideoKey() {
    console.log(this.store.user._id, this.activeChatKey);
    this.socket.publish({
      destination: "/app/video-key-request",
      body: JSON.stringify({
        userId: this.store.user._id,
        room: this.activeChatKey,
      }),
    });
  }

  randomId(): string {
    const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return uint32.toString(16);
  }

  whatsAppTest() {
    window.open("https://wa.me/2347011636330?text=HELLO%20Balocodes");
    // this._http
    //   .get(
    //     "https://wa.me/2347011636330?text=HELLO%20Balocodes"
    //   )
    //   .subscribe(
    //     (resp) => {
    //       console.log("Whatsapp resp", resp);
    //     },
    //     (err) => {
    //       console.log("Whatsapp err", err);
    //     }
    //   );
  }
}
