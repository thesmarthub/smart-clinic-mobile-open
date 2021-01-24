import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
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
  constructor(private _authService: AuthService, private fb: FormBuilder) {}

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
