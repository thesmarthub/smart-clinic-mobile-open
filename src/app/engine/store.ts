import * as moment from "moment";
import { IDepartment, IHospital } from "src/interfaces/hospital";
import { IUser } from "src/interfaces/user";

export class Store {
  set firebaseToken(val) {
    localStorage.setItem("firebase_reg_token", val);
  }

  get firebaseToken() {
    return localStorage.getItem("firebase_reg_token");
  }

  set token(val) {
    localStorage.setItem("token", val);
  }

  get token(): string {
    return localStorage.getItem("token");
  }

  set user(data: IUser) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  get user(): IUser {
    return JSON.parse(localStorage.getItem("user"));
  }

  get userFullName(): string {
    return `${this.user.fname} ${this.user.lname}`;
  }

  set profileImage(url: string) {
    const user = this.user;
    user.profileImage = url;
    this.user = user;
  }

  set currentHospital(data) {
    localStorage.setItem("currentHospital", JSON.stringify(data));
  }

  get currentHospital(): IHospital {
    return JSON.parse(localStorage.getItem("currentHospital"));
  }

  set department(data) {
    localStorage.setItem("department", JSON.stringify(data));
  }

  get department() {
    return JSON.parse(localStorage.getItem("department"));
  }
  set staff(data) {
    localStorage.setItem("staff", JSON.stringify(data));
  }

  get staff() {
    return JSON.parse(localStorage.getItem("staff"));
  }

  set lastLoginTime(time: moment.Moment) {
    localStorage.setItem("lastLoginTime", time.toString());
  }

  get lastLoginTime() {
    return moment(localStorage.getItem("lastLoginTime"));
  }

  get notNeedLogin() {
    return this.lastLoginTime.add(5, "minutes").isAfter(moment());
  }

  addFirebaseKey(key) {
    const user = this.user;
    user.firebase_key = key;
    this.user = user;
  }

  clearStore() {
    localStorage.clear();
  }
}
