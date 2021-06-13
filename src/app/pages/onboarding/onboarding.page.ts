import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-onboarding",
  templateUrl: "./onboarding.page.html",
  styleUrls: ["./onboarding.page.scss"],
})
export class OnboardingPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  slideOpts = {
    initialSlide: 0,
    speed: 200,
    autoplay: {
      delay: 5000,
    },
    
  };
}
