import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Store } from "src/app/engine/store";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.page.html",
  styleUrls: ["./user-profile.page.scss"],
})
export class UserProfilePage implements OnInit {
  storeCtrl = new Store();
  regForm: FormGroup;
  registering = false;
  showNextOfKin = false;
  profile: any = {}
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
    public _location: Location,
    public fb: FormBuilder,
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
      next_of_kin_fname: [
        this.storeCtrl.user.next_of_kin_fname,
        Validators.required,
      ],
      next_of_kin_lname: [
        this.storeCtrl.user.next_of_kin_lname,
        Validators.required,
      ],
      next_of_kin_email: [
        this.storeCtrl.user.next_of_kin_email,
        Validators.required,
      ],
      next_of_kin_phone: [
        this.storeCtrl.user.next_of_kin_phone,
        Validators.required,
      ],
      next_of_kin_sex: [
        this.storeCtrl.user.next_of_kin_sex,
        Validators.required,
      ],
      next_of_kin_relationship: [
        this.storeCtrl.user.next_of_kin_relationship,
        Validators.required,
      ],
    });
  }

  ngOnInit() {}

  backClicked() {
    this._location.back();
  }
  showKin() {
    // this.showNextOfKin = true;
    if (this.showNextOfKin) {
      this.showNextOfKin = false;
    } else {
      this.showNextOfKin = true;
    }
  }

  editProfile() {
    this.authService.editUserDetails(this.regForm.value)
    console.log(this.regForm.value)
  }

  fileChange(file) {
    const formData = new FormData();
    formData.append("files", file.target["files"][0]);
    this.authService.updateUserImage(formData, this.storeCtrl.user._id);
  }
}
