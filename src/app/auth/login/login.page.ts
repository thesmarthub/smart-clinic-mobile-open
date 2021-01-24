import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../auth.service';

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
  subs: Subscription[] = [];

  constructor(private _authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.subs.push(
      this._authService.authListenerWithData.subscribe((status) => {
        if (status.event === "LOGGING IN") {
          this.loading = true;
        } else {
          this.loading = false;
        }
        if (status.event === "LOGIN FAILED" && status.data) {
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

  login() {
    this._authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
  }
}
