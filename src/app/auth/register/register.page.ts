import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AlertController, LoadingController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { GeneralService } from "src/app/services/general.service";
import { AuthService } from "../auth.service";


@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  regForm: FormGroup;
  subs: Subscription[] = [];
  registering = false;
  loaderConf = {
    message: "Please wait...",
    currentEvent: "",
    expectedEvent: "REGISTERING",
  };

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private gService: GeneralService,
 
  ) {
    this.regForm = this.fb.group({
      fname: ["", Validators.required],
      lname: ["", Validators.required],
      email: ["", Validators.required, Validators.email],
      phone: ["", Validators.required],
      password: ["", Validators.required, Validators.minLength(8)],
      d_o_b: ["", Validators.required,],
      sex: ["", Validators.required],
    });
  }

  ngOnInit() {
    const sub1 = this.authService.authListenerWithData.subscribe(
      async (status) => {
        this.registering = status.event === "REGISTERING";
        this.loaderConf.currentEvent = status.event;
        this.gService.presentLoading(this.loaderConf);
        if (status?.data) {
          const alert = await this.alertCtrl.create({
            message: status.data,
            buttons: ["OK"],
          });
          alert.present();
        }
      }
    );
    this.subs.push(sub1);
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    });
  }

  async registerUser() {
    Object.keys(this.regForm.value).forEach(
      (key) => (this.regForm.value[key] = this.regForm.value[key].trim())
    );

    console.log(this.regForm.value);

    if (!this.regForm.valid) {
      const alert = await this.alertCtrl.create({
        message: "Please enter all required information.",
        buttons: ["OK"],
      });
      alert.present();
      return;
    }
    this.authService.register(this.regForm.value);
  }


}
