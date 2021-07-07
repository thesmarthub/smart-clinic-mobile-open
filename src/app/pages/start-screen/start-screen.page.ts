import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "src/app/engine/store";

@Component({
  selector: "app-start-screen",
  templateUrl: "./start-screen.page.html",
  styleUrls: ["./start-screen.page.scss"],
})
export class StartScreenPage implements OnInit {
  frameClass = "frame";
  doctorQuestion = false;
  storeCtrl = new Store();
  selectedRadioGroup: "user" | "doctor" = "user";
  constructor(public router: Router) {}

  ngOnInit() {}

  ionViewDidEnter() {
    // this.userType.value = 'user'
    setTimeout(() => {
      this.frameClass = "frame loaded";

      setTimeout(() => {
        console.log(this.storeCtrl.userType);
        if (this.storeCtrl.userType && this.storeCtrl.rememberUserType) {
          this.router.navigate(["/onboarding"]);
        } else {
          this.storeCtrl.userType = this.selectedRadioGroup;
          this.doctorQuestion = true;
        }
      }, 3000);
    }, 200);
    // this.next()
  }

  radioGroupChange() {
    this.storeCtrl.userType = this.selectedRadioGroup;
  }

  nextPage() {
    this.router.navigate(["onboarding"]);
  }

  rememberChoice(el) {
    console.log(el.detail.checked);
    this.storeCtrl.rememberUserType = el.detail.checked;
  }
}
