import { ComponentRef, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { BehaviorSubject } from "rxjs";
import { Store } from "../engine/store";
import { Router } from "@angular/router";
import { SmartNotification } from "../engine/smart-notification";
import { IHospital } from "../../interfaces/hospital";
import { IAPIResponse } from "../../interfaces/general";
import { IUser } from "../../interfaces/user";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { ChatService } from "../services/chat.service";
import * as moment from "moment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  readonly baseURL = environment.baseURL;
  readonly authListenerWithData = new BehaviorSubject<AuthEventWithData>({
    event: "DEFAULT",
  });
  readonly store = new Store();
  patient_profile = new BehaviorSubject([]);
  readonly activeComponent: ComponentRef<any>;
  readonly toaster = new SmartNotification().toaster;

  constructor(
    private _http: HttpClient,
    private router: Router,
    private iab: InAppBrowser,
    private chatService: ChatService
  ) {}

  navigate(link, queryParams) {
    this.router.navigate([link], { queryParams });
  }

  login(email, password) {
    this.authListenerWithData.next({ event: "LOGGING IN" });
    this._http
      .post<IAPIResponse<IUser>>(`${this.baseURL}auth/login-patient`, {
        email,
        password,
      })
      .subscribe(
        (res) => {
          // console.log(res, "loged in res")
          if (this.authSuccess(res)) {
            // this.chatService.initialize();
            this.storeAuthData(res, "LOGGED IN");
            this.createChatProfile();
            if (this.store.userType === "doctor") {
              this.authListenerWithData.next({ event: "LOGGED IN" });
              this.toaster({
                text: `Welcome, ${this.store.user.fname}`,
                duration: 2000,
              });
            } else {
              this.fetchActiveHospitalAndProfile(
                this.store.user.active_hospital_smart_code ||
                  "SMART_CLINIC_DEFAULT"
              );
            }
          } else {
            console.log(res.message);
            this.authListenerWithData.next({
              event: "LOGIN FAILED",
              data: res.message,
            });
          }
        },
        (err) => {
          console.log(err);
          this.authListenerWithData.next({
            event: "LOGIN FAILED",
            data: "Please check your internet connection",
          });
        }
      );
  }

  register(data) {
    this.authListenerWithData.next({ event: "REGISTERING" });

    this._http
      .post<IAPIResponse<IUser>>(`${this.baseURL}auth/register-patient`, data)
      .subscribe(
        (res) => {
          if (this.authSuccess(res)) {
            this.storeAuthData(res, "REGISTERED");
            this.toaster({
              text: `Registration Successful, ${this.store.user.fname}`,
              duration: 2000,
            });
            this.login(data.email, data.password);
          } else {
            this.authListenerWithData.next({
              event: "REGISTER FAILED",
              data: res.message,
            });
          }
        },
        (err) => {
          this.authListenerWithData.next({
            event: "REGISTER FAILED",
            data: "Registration may have failed. Please check your internet connection",
          });
        }
      );
  }

  validateHMO(data) {
    this.authListenerWithData.next({ event: "VALIDATING HMO" });

    this._http
      .post<IAPIResponse<any>>(`${this.baseURL}auth/validate-hmo`, data)
      .subscribe(
        (res) => {
          if (this.authSuccess(res)) {
            this.authListenerWithData.next({
              event: "VALIDATE HMO SUCCESS",
              data: res.message,
            });
            this.toaster({ text: `HMO Validation Successful`, duration: 2000 });
          } else {
            this.authListenerWithData.next({
              event: "VALIDATE HMO FAILED",
              data: res.message,
            });
            this.toaster({ text: `HMO Validation Failed`, duration: 2000 });
          }
        },
        (err) => {
          this.authListenerWithData.next({
            event: "VALIDATE HMO FAILED",
            data: "HMO validations of success.",
          });
        }
      );
  }
  initializeProfile(id, hospitalNumber?) {
    // this.authListenerWithData.next({ event: 'LOGGING IN' });
    this._http
      .get<IAPIResponse<any>>(`${this.baseURL}auth/get-patient/${id}`)
      .subscribe(
        (res: any) => {
          if (res?.result) {
            console.log(res);
            if (hospitalNumber) {
              res["result"].hospital_number = hospitalNumber;
            }
            this.patient_profile.next(res["result"]);
            this.store.user = res["result"];
          } else {
            this.toaster({
              text: "Could not fetct patient. Please try again.",
              duration: 2000,
            });
            console.log(res);
            // this.authListenerWithData.next({ event: 'DEFAULT' });
          }
        },
        (err) => {
          // this.toaster(
          //   'Could not fetch active hospital. Please check your connection and try again.'
          // );
          // this.authListenerWithData.next({ event: 'DEFAULT' });
          console.log(err);
        }
      );
  }

  editUserDetails(data, showNotification = true) {
    this._http
      .post<IAPIResponse<any>>(
        `${this.baseURL}auth/edit-patient/${this.store.user._id}`,
        data
      )
      .subscribe((res) => {
        if (showNotification) {
          alert(res.message);
        }
        this.initializeProfile(
          this.store.user._id,
          this.store.user.hospital_number
        );
      });
  }

  updatePassword(data, id) {
    this._http
      .post<IAPIResponse<any>>(
        `${this.baseURL}auth/update-password/${id}`,
        data
      )
      .subscribe((res) => {
        alert(res.message);
        console.log(res);
        // this.initializeProfile(data._id)
      });
  }

  updateUserImage(data, _id) {
    console.log(data);
    this._http
      .post<IAPIResponse<any>>(
        `${this.baseURL}auth/edit-patient-image/${_id}`,
        data
      )
      .subscribe((res) => {
        this.toaster({ text: res.message, duration: 2000 });
        this.initializeProfile(_id, this.store.user.hospital_number);
      });
  }

  sendRecoveryRequest(email) {
    this.authListenerWithData.next({ event: "RECOVERING ACCOUNT" });
    this._http
      .post<IAPIResponse<any>>(`${this.baseURL}auth/recovery-request`, {
        email,
      })
      .subscribe(
        (res) => {
          if (res["error"] === false) {
            this.authListenerWithData.next({
              event: "RECOVERY SENT",
              data: "Recovery email has been sent.",
            });
            this.router.navigateByUrl("/auth/login");
          } else {
            this.authListenerWithData.next({
              event: "RECOVERY FAILED",
              data: res.message,
            });
          }
        },
        (err) => {
          this.authListenerWithData.next({
            event: "RECOVERY FAILED",
            data: "Could not sent recovery request. Please check you internet connection.",
          });
        }
      );
  }

  fetchActiveHospitalAndProfile(smartCode, callback = () => {}) {
    this.authListenerWithData.next({ event: "FETCHING HOSPITAL PROFILE" });
    this._http
      .get<IAPIResponse<IHospital>>(
        `${this.baseURL}hospital/fetch-hospital?smart_code=${smartCode}`
      )
      .subscribe(
        (res) => {
          if (res?.result) {
            this.fetchProfileInHospital(res.result, callback);
          } else {
            this.toaster({
              text: "Could not fetch active hospital. Please try again.",
              duration: 2000,
            });
            this.authListenerWithData.next({ event: "LOGIN FAILED" });
          }
        },
        (err) => {
          this.toaster({
            text: "Could not fetch active hospital. Please check your connection and try again.",
            duration: 2000,
          });
          this.authListenerWithData.next({ event: "DEFAULT" });
        }
      );
  }

  fetchProfileInHospital(selectedHospital: IHospital, callback = () => {}) {
    console.log(selectedHospital);
    this._http
      .get<IAPIResponse<IUser>>(`${this.baseURL}hospital/patient-request`, {
        params: {
          action: "FETCH_PATIENT_PROFILE",
          hospital_smart_code: selectedHospital.smart_code,
        },
      })
      .subscribe(
        (res) => {
          console.log("Profile in hospital", res)
          const userClone = this.store.user;

          if (res?.result?.hospital_number) {
            userClone.hospital_number = res.result.hospital_number;

            if (selectedHospital) {
              this.editUserDetails(
                { active_hospital_smart_code: selectedHospital.smart_code },
                false
              );
              userClone.active_hospital_smart_code =
                selectedHospital.smart_code;
              userClone.currentHospital = selectedHospital;
              this.store.currentHospital = selectedHospital;
            }

            this.store.user = userClone;

            // console.log("after cloning", this.store.user)
            this.authListenerWithData.next({ event: "LOGGED IN" });
            this.toaster({
              text: `Welcome, ${this.store.user.fname}`,
              duration: 2000,
            });
            this.router.navigateByUrl("/tabs/home");
          } else if (selectedHospital.smart_code !== "SMART_CLINIC_DEFAULT") {
            const currentHospitalClone = this.store.currentHospital;
            currentHospitalClone["smart_code"] = "SMART_CLINIC_DEFAULT";
            this.store.currentHospital = currentHospitalClone;

            this.fetchProfileInHospital(this.store.currentHospital);
            // } else if (mustFetch) {
            //   // this.toaster('Could not find profile in hospital');
            //   this.defaultHospitalRegistration();

            //   this.authListenerWithData.next({ event: "DEFAULT" });
          } else {
            this.toaster({
              text: "Could not find profile in hospital",
              duration: 2000,
            });

            this.authListenerWithData.next({
              event: "FAILED TO FIND HOSPITAL PROFILE",
              data: "Not registered in this hospital",
            });
          }
        },
        (err) => {
          this.toaster({
            text: "Could not fetch profile in selected hospital",
            duration: 2000,
          });
          this.authListenerWithData.next({ event: "DEFAULT" });
        },
        () => {
          callback();
        }
      );
  }

  //Should be deprecated in favor of a more reliable solurioin
  defaultHospitalRegistration() {
    this._http
      .post<IAPIResponse<IUser>>(
        `${this.baseURL}hospital/patient-request?action=REGISTER_PATIENT&hospital_smart_code=SMART_CLINIC_DEFAULT&patient_smart_code=${this.store.user.smart_code}`,
        { data: this.store.user }
      )
      .subscribe((res) => {
        if (res?.result && res.result._id) {
          console.log(res?.result);
          this.authListenerWithData.next({ event: "LOGGED IN" });
          this.router.navigateByUrl("/tabs/home");
        }
      });
  }

  authSuccess(res): boolean {
    return res && !res["error"] && res["token"];
  }

  storeAuthData(res, action: AuthEvent): void {
    // this.authListenerWithData.next({ event: action });
    this.store.token = res["token"];
    this.store.user = res["result"];
    this.store.lastLoginTime = moment();
    this.store.addFirebaseKey(this.store.firebaseToken);
    if (!(this.store.userType === "doctor")) {
      this.editUserDetails(this.store.user, false);
    }
  }

  socialLogin() {
    const browser = this.iab.create("http://localhost:8080");
  }

  registerDoctor() {
    const browser = this.iab.create(
      "https://docs.google.com/forms/d/e/1FAIpQLSc-UVDE0mQvNZ6MLy54yMN9tCyNG0Coy9bysGKU5xK5n0OgsQ/viewform"
    );
  }

  createChatProfile() {
    this._http
      .post(
        `${this.baseURL}auth/comet?uid=${this.store.user._id}&comet_method=POST&comet_url=users`,
        {
          data: {
            uid: this.store.user._id,
            name: `${this.store.user.fname} ${this.store.user.lname}`,
            status: "online",
            createdAt: new Date().getTime(),
          },
        }
      )
      .toPromise()
      .then((data) => {
        console.log("comet chat", data);
        this._http
          .post(
            `${this.baseURL}auth/comet?uid=${this.store.user._id}&comet_method=POST&comet_url=users/${this.store.user._id}/auth_tokens`,
            {}
          )
          .toPromise()
          .then(
            (resp: {
              data: Record<string, any>;
              meta: Record<string, any>;
            }) => {
              console.log(resp)
              if (resp?.data && resp.data) {
                this.store.cometAuthKey = resp?.data["authToken"];
              }
            }
          )
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
}

export interface AuthEventWithData<T = string> {
  event: AuthEvent;
  data?: T;
}

export type AuthEvent =
  | "LOGGED IN"
  | "LOGGING IN"
  | "LOGIN FAILED"
  | "REGISTERING"
  | "REGISTERED"
  | "REGISTER FAILED"
  | "RECOVERING ACCOUNT"
  | "RECOVERY SENT"
  | "RECOVERY FAILED"
  | "FETCHING HOSPITAL PROFILE"
  | "FAILED TO FIND HOSPITAL PROFILE"
  | "VALIDATING HMO"
  | "VALIDATE HMO FAILED"
  | "VALIDATE HMO SUCCESS"
  | "DEFAULT";
