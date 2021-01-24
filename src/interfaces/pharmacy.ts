export interface IPrescription<
  Drug,
  Department = string,
  Patient = string,
  RaisedBy = string,
  Appointment = string
> {
  appointment: Appointment;
  created_at: string;
  department: Department;
  diagnosis: string;
  direct_prescription: string;
  drugs: Drug[];
  item_name: string;
  general_instruction: string;
  hospital_branch_code: string;
  hospital_number: string;
  is_follow_up: boolean;
  patient: Patient;
  raised_by: RaisedBy;
  status: string;
  updated_at: string;
  _id: string;
}

export interface IDrug<DrugItem> {
  bill_generated: boolean;
  dispensed: string;
  drug: DrugItem;
  injection: boolean;
  paid: boolean;
  payment_status: boolean;
  quantity: number;
  _id: string;
}
