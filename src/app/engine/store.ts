import { CometChat } from "@cometchat-pro/chat";
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

  set userType(data) {
    if (!data) {
      localStorage.removeItem("userType");
      return;
    }
    const props = ["doctor", "user"];
    if (!props.includes(data)) {
      throw new Error(`User type must be in ${JSON.stringify(props)}`);
    }
    localStorage.setItem("userType", JSON.stringify(data));
  }

  get userType(): "doctor" | "user" {
    const data = localStorage.getItem("userType");
    if (!data) return;
    return JSON.parse(data);
  }

  set rememberUserType(val: boolean) {
    console.log(val)
    if (val) {
      localStorage.setItem("rememberUserType", "yes");
    } else {
      localStorage.setItem("rememberUserType", "no");
    }
  }

  get rememberUserType() {
    return localStorage.getItem("rememberUserType") === "yes";
  }

  set lastLoginTime(time: moment.Moment) {
    localStorage.setItem("lastLoginTime", time.toString());
  }

  get lastLoginTime() {
    const toReturn = localStorage.getItem("lastLoginTime")
      ? moment(localStorage.getItem("lastLoginTime"))
      : moment().subtract(10, "minute");
    return toReturn;
  }

  get notNeedLogin() {
    return this.lastLoginTime.add(5, "minutes").isAfter(moment());
  }

  addFirebaseKey(key) {
    const user = this.user;
    user.firebase_key = key;
    this.user = user;
  }

  set cometAuthKey(key) {
    localStorage.setItem("comet-auth", key);
  }

  get cometAuthKey() {
    return localStorage.getItem("comet-auth");
  }

  set activeChatDoctor(doctor) {
    if (doctor === null) {
      localStorage.removeItem("activeChatDoctor");
    }
    localStorage.setItem("activeChatDoctor", JSON.stringify(doctor));
  }

  get activeChatDoctor() {
    const _activeChatDoctor = localStorage.getItem("activeChatDoctor");
    if (!_activeChatDoctor) return null;
    return JSON.parse(_activeChatDoctor);
  }

  clearStore(skipUserType?:boolean) {
    this.activeChatDoctor = null;
    if (!this.rememberUserType && !skipUserType) {
      this.userType = null;
    }
    localStorage.removeItem("user");
    localStorage.removeItem("currentHospital");
    localStorage.removeItem("token");
    localStorage.removeItem("lastLoginTime");
  }
}
