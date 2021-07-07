import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { Store } from "src/app/engine/store";

@Component({
  selector: "app-onboarding",
  templateUrl: "./onboarding.page.html",
  styleUrls: ["./onboarding.page.scss"],
})
export class OnboardingPage implements OnInit {
  store = new Store();
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {}

  slideOpts = {
    initialSlide: 0,
    speed: 200,
    autoplay: {
      delay: 5000,
    },
  };

  navigateToStart() {
    this.store.rememberUserType = false;
    this.store.userType = null;
    this.router.navigate(["/start-screen"]);
  }
}
