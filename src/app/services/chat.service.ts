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
  constructor(private _http: HttpClient) {}

  async runner(link, method, body) {
    return await this._http
      .post(`https://health.smartapps.com.ng/mobile/auth/comet?comet_url=${link}&comet_method=${method}`, { data: body })
      .toPromise()
      .then((res) => res)
      .catch((err) => console.log(err));
  }
}
