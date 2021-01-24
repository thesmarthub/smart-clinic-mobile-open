export interface IHospital {
  address: string;
  // base_url: string;
  country: string;
  created_at: string;
  departments: IDepartment[];
  email1: string;
  email2: string;
  name: string;
  phone1: string;
  secret_code: string;
  show_doctors: boolean;
  smart_code: string;
  state: string;
  target: string;
  updated_at: string;
  __v: number;
  _id: string;
}

export interface IDepartment {
  name: string;
  route: string;
  status: boolean;
  _id: string;
  consultation_cost?: string;
  force_hospital_cost?: boolean;
}
