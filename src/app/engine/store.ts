import {IDepartment, IHospital} from 'src/interfaces/hospital';
import { IUser } from 'src/interfaces/user';

export class Store {
  set token(val) {
    localStorage.setItem('token', val);
  }

  get token(): string {
    return localStorage.getItem('token');
  }

  set user(data) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  get user(): IUser {
    return JSON.parse(localStorage.getItem('user'));
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
    localStorage.setItem('tempHospital', JSON.stringify(data));
  }

  get tempHospital(): IHospital {
    if (!localStorage.getItem('tempHospital')) {
      return;
    }
    return JSON.parse(localStorage.getItem('tempHospital'));
  }

  set department(data) {
    localStorage.setItem('department', JSON.stringify(data));
  }

  get department() {
    return JSON.parse(localStorage.getItem('department'));
  }
  set staff(data) {
    localStorage.setItem('staff', JSON.stringify(data));
  }

  get staff() {
    return JSON.parse(localStorage.getItem('staff'));
  }

  clearStore() {
    localStorage.clear();
  }

}