import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  welcome = true;
  appointments = false;
  notifications = false;
  hospitals = false;
  payment = false;

  constructor() { }

  ngOnInit() {
  }

  next(){
    this.appointments = true;
    this.welcome = false
  }

  nextNotifications(){
    this.notifications = true
    this.appointments = false
  }

  nextHospitals(){
    this.hospitals = true
    this.notifications = false
  }

  nextPayment(){
    this.payment = true
    this.hospitals = false
  }

}
