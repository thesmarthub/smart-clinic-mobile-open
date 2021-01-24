export interface IFullLabRequest<
  LabRequest,
  Appointment = string,
  Patient = string,
  RaiseBy = string
> {
  appointment: Appointment;
  created_at: string;
  diagnosis: string;
  general_instruction: string;
  hospital_branch_code: string;
  hospital_number: string;
  is_follow_up: boolean;
  nyr_patient: Patient;
  patient: Patient;
  patient_type: 'r' | 'nyr';
  payment_status: boolean;
  raised_by: RaiseBy;
  requests: LabRequest[];
  status: 'pending' | 'verified';
  updated_at: string;
  _id: string;
}

export interface ILabRequest<Service> {
  bill_generated: boolean;
  paid: boolean;
  payment_status: boolean;
  test: Service;
  _id: string;
}
