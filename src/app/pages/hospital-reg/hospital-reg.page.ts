import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Location } from "@angular/common";
import { Store } from "src/app/engine/store";
import { HospitalService } from "src/app/services/hospital.service";
import { AuthService } from "src/app/auth/auth.service";
import { async } from "@angular/core/testing";

@Component({
  selector: "app-hospital-reg",
  templateUrl: "./hospital-reg.page.html",
  styleUrls: ["./hospital-reg.page.scss"],
})
export class HospitalRegPage implements OnInit {
  regForm: FormGroup;
  registering = false;
  showNextOfKin = false;
  storeCtrl = new Store();

  kins = [
    "Mother",
    "Father",
    "Brother",
    "Sister",
    "Nephew",
    "Niece",
    "Aunt",
    "Uncle",
    "Grand Mother",
    "Grand Father",
  ];

  constructor(
    public hService: HospitalService,
    public fb: FormBuilder,
    public _location: Location,
    public authService: AuthService
  ) {
    this.regForm = this.fb.group({
      fname: [this.storeCtrl.user.fname, Validators.required],
      lname: [this.storeCtrl.user.lname, Validators.required],
      email: [this.storeCtrl.user.email, Validators.required],
      phone: [this.storeCtrl.user.phone, Validators.required],
      d_o_b: [this.storeCtrl.user.d_o_b, Validators.required],
      sex: [this.storeCtrl.user.sex, Validators.required],
      smart_code: [this.storeCtrl.user.smart_code, Validators.required],
      state: [this.storeCtrl.user.state],
      address: [this.storeCtrl.user.address],
      profile_image: [this.storeCtrl.user.profileImage, Validators.required],
      next_of_kin_fname: [""],
      next_of_kin_lname: [""],
      next_of_kin_email: [""],
      next_of_kin_phone: [""],
      next_of_kin_sex: [""],
      next_of_kin_relationship: [""],
    });
  }

  ngOnInit() {}

  showKin() {
    // this.showNextOfKin = true;
    if (this.showNextOfKin) {
      this.showNextOfKin = false;
    } else {
      this.showNextOfKin = true;
    }
  }

  backClicked() {
    this._location.back();
    // console.log(this.authService.fetchActiveHospitalAndProfile)
  }

  registerInHospital() {
    this.registering = true;
    try {
      this.hService
        .registerInHospital(this.regForm.value, this.hService.tempHospital)
        .subscribe(
          (res) => {
            console.log(res);
            if (!res.error) {
              this.authService.fetchProfileInHospital(
                this.hService.tempHospital
              );
            } else {
              this.authService.toaster(res.message);
            }
          },
          (error) => {
            console.log(error, "failed to send");
            this.authService.toaster(error.message);
          },
          () => {
            this.registering = false;
            this.hService.tempHospital = null;
          }
        );
    } catch (e) {
      console.log(e, "catch e");
      this.authService.toaster(e.message);
    }
  }
}
