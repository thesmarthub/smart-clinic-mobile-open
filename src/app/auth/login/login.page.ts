import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { Subscription } from "rxjs/internal/Subscription";
import { Store } from "src/app/engine/store";
import { GeneralService } from "src/app/services/general.service";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  loginForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
  });

  loading = false;
  loaderConf = {
    message: "Please wait...",
  };
  subs: Subscription[] = [];

  constructor(
    public _authService: AuthService,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private gService: GeneralService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  ionViewDidEnter() {
    console.log("Subs", this.subs);
    this.subs = [];
    this.subs.push(
      this._authService.authListenerWithData.subscribe((status) => {
        if (status.event === "LOGGING IN") {
          this.gService.presentLoading(this.loaderConf, "open");
        }
        if (status.event === "LOGGED IN") {
          this.gService.presentLoading(this.loaderConf, "close");
          if (this._authService.store.userType === "doctor") {
            this._authService.navigate("/tabs/home", {});
            this._authService.authListenerWithData.next({ event: "DEFAULT" });
          }
        }
        if (status.event === "LOGIN FAILED") {
          console.log("Failed to login!!!", status);
          this.gService.presentLoading(this.loaderConf, "close");
          this.showAlert(status.data);
          // this._authService.toaster({ text: status.data, duration: 2000 });
        }
      })
    );
  }

  resetVariables() {
    this.subs = [];
    this.loaderConf = {
      message: "Please wait...",
    };
  }

  ionViewDidLeave() {
    this.gService.presentLoading(this.loaderConf, "close");
    this.subs.forEach((sub, index) => {
      if (!sub.closed) {
        sub.unsubscribe();
      }
      if (index === this.subs.length - 1) {
        this.resetVariables();
      }
    });
  }

  login() {
    new Store().clearStore();
    if (!this.loginForm.value.email || !this.loginForm.value.password) {
      this.showAlert("Please enter valid email and password.");
      return;
    }

    this._authService.login(
      this.loginForm.value.email.trim(),
      this.loginForm.value.password.trim()
    );
  }

  async showAlert(message) {
    const alert = await this.alertCtrl.create({
      message,
      header: "Login Failed",
      buttons: ["OK"],
    });
    alert.present();
  }
}
