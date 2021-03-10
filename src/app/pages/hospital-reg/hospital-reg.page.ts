import { Component, OnInit } from '@angular/core';
import { FormBuilder,
  FormControl,
  FormGroup,
  Validators, } from '@angular/forms';
  import {Location} from '@angular/common';
import { Store } from 'src/app/engine/store';

@Component({
  selector: 'app-hospital-reg',
  templateUrl: './hospital-reg.page.html',
  styleUrls: ['./hospital-reg.page.scss'],
})
export class HospitalRegPage implements OnInit {
  regForm: FormGroup;
  registering = false;
  showNextOfKin = false;
  storeCtrl = new Store()

  kins = ["Mother", "Father", "Brother", "Sister", "Nephew", "Niece", "Aunt", "Uncle", "Grand Mother", "Grand Father" ];

  constructor(
     public fb: FormBuilder,
    public _location: Location,) {
    this.regForm = this.fb.group({
      fname: [ this.storeCtrl.user.fname, Validators.required],
      lname: [this.storeCtrl.user.lname, Validators.required],
      email: [this.storeCtrl.user.email, Validators.required],
      phone: [this.storeCtrl.user.phone, Validators.required],
      d_o_b: [this.storeCtrl.user.d_o_b, Validators.required],
      sex: [this.storeCtrl.user.sex, Validators.required],
      next_of_kin_fname: ["", Validators.required],
      next_of_kin_lname: ["", Validators.required],
      next_of_kin_email: ["", Validators.required],
      next_of_kin_phone: ["", Validators.required],
      next_of_kin_sex: ["", Validators.required],
      next_of_kin_relationship: ["", Validators.required],
    });
   }

  ngOnInit() {
  }

  showKin(){
    // this.showNextOfKin = true;
    if(this.showNextOfKin){
      this.showNextOfKin = false
    }else{
      this.showNextOfKin = true
    }

  }

  backClicked() {
    this._location.back();
  }

}
