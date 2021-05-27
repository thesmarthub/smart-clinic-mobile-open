import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Store } from "src/app/engine/store";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.page.html",
  styleUrls: ["./reset-password.page.scss"],
})
export class ResetPasswordPage implements OnInit {
  recoveryForm = this.fb.group({
    email: ["", [Validators.email, Validators.required]],
  });
  subs: Subscription[] = [];
  loading = false;
  changingPassword = false;
  store = new Store();

  constructor(
    private _authService: AuthService,
    private fb: FormBuilder,
    private aRoute: ActivatedRoute
  ) {
    this.aRoute.queryParams.subscribe((params) => {
      if (params.from_menu === "yes") {
        this.changingPassword = true;
        this.recoveryForm.setValue({ email: this.store.user.email });
      } else {
        this.changingPassword = false;
      }
    });
  }

  ngOnInit(): void {
    this.subs.push(
      this._authService.authListenerWithData.subscribe((status) => {
        if (status.event === "RECOVERING ACCOUNT") {
          this.loading = true;
        } else {
          this.loading = false;
        }
        if (status.event === "RECOVERY FAILED") {
          this._authService.toaster({ text: status.data, duration: 2000 });
        }
        if (status.event === "RECOVERY SENT") {
          this._authService.toaster({ text: status.data, duration: 2000 });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    });
  }

  submitRequest() {
    this._authService.sendRecoveryRequest(this.recoveryForm.value.email);
  }
}
