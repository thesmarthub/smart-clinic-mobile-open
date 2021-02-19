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

  set currentHospital(data) {
    const newUser = this.user;
    newUser.currentHospital = data;
    this.user = newUser;
  }

  get currentHospital(): IHospital {
    return this.user?.currentHospital;
  }

  set tempHospital(data: IHospital) {
    localStorage.setItem("tempHospital", JSON.stringify(data));
  }

  get tempHospital(): IHospital {
    if (!localStorage.getItem("tempHospital")) {
      return;
    }
    return JSON.parse(localStorage.getItem("tempHospital"));
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

  clearStore() {
    localStorage.clear();
  }
}
