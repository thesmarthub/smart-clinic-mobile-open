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
  selectedRadioGroup: "user" | "doctor" = "user";
  storeCtrl = new Store();
  constructor(public router: Router) {}

  ngOnInit() {
    // this.userType.value = 'user'
    setTimeout(() => {
      this.frameClass = "frame loaded";

      setInterval(() => {
        this.doctorQuestion = true;
      }, 3000);
    }, 200);

    this.radioGroupChange(event);
    // this.next()
  }

  radioGroupChange(event) {
    this.storeCtrl.userType = "user";
    // console.log("radioGroupChange", event.detail);
    this.storeCtrl.userType = this.selectedRadioGroup;
  }

  nextPage(){
    console.log('next')
    this.router.navigate(['onboarding'])
    
  }
}
