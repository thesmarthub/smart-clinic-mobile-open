import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-onboarding",
  templateUrl: "./onboarding.page.html",
  styleUrls: ["./onboarding.page.scss"],
})
export class OnboardingPage implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit() {}

  slideOpts = {
    initialSlide: 0,
    speed: 200,
    autoplay: {
      delay: 5000,
    },
    
  };
}
