import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChatService } from "src/app/services/chat.service";
import * as Video from "twilio-video";

@Component({
  selector: "app-video-chat",
  templateUrl: "./video-chat.page.html",
  styleUrls: ["./video-chat.page.scss"],
})
export class VideoChatPage implements OnInit {
  videoConnection;
  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit() {
    // video.connect(token).then((room)=> {
    //   console.log("You are connected to", room.name)
    // });
    this.connectVideo(
      this.chatService.videoAccessKey,
      this.chatService.activeChatKey
    );
  }

  ionViewDidLeave() {}

  connectVideo(token, room) {
    Video.connect(token, { name: room }).then((room) => {
      console.log('Connected to Room "%s"', room.name);
      room.participants.forEach(this.participantConnected);
      room.on("participantConnected", this.participantConnected);

      room.on("participantDisconnected", this.participantDisconnected);
      room.on("disconnected", (error) =>
        room.participants.forEach(this.participantDisconnected)
      );
    });
  }

  participantConnected = (participant) => {
    console.log('Participant "%s" connected', participant.identity);

    const el = document.getElementById("chat");
    el.id = participant.sid;
    // el.innerText = participant.identity;

    participant.on("trackSubscribed", (track) =>
      this.trackSubscribed(el, track)
    );
    participant.on("trackUnsubscribed", this.trackUnsubscribed);

    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed) {
        this.trackSubscribed(el, publication.track);
      }
    });

    // document.getElementById("videoFeed").appendChild(div);
  };

  participantDisconnected = (participant) => {
    console.log('Participant "%s" disconnected', participant.identity);
    document.getElementById(participant.sid).remove();
  };

  trackSubscribed = (div, track) => {
    div.appendChild(track.attach());
  };

  trackUnsubscribed = (track) => {
    track.detach().forEach((element) => element.remove());
  };

  switchToChat() {
    this.router.navigateByUrl("/tabs/chat")
  }
}