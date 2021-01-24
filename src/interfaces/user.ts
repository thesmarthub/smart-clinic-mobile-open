import { IHospital } from './hospital';

export interface IUser extends ILoginData, IRegisterData {
  active_hospital_smart_code: string;
  created_at: string;
  currentHospital: IHospital;
  hospital_number: string;
  hospital_smart_codes: string[];
  smart_code: string;
  updated_at: string;
  __v: number;
  _id: string;

  next_of_kin_fname?: string;
  next_of_kin_lname?: string;
  next_of_kin_phone?: string;
  next_of_kin_email?: string;
  next_of_kin_relationship?: string;
  next_of_kin_sex?: string;

  profile_image?: string;
  next_of_kin_address?: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterData {
  address: string;
  d_o_b: string;
  fname: string;
  lname: string;
  phone: string;
  sex: string;
  state: string;
}
