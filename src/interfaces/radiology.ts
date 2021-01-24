export interface IFullScanRequest<
  ScanRequest,
  Appointment = string,
  Patient = string,
  RaiseBy = string
> {
  appointment: Appointment;
  completed: boolean;
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
  requests: ScanRequest[];
  updated_at: string;
  _id: string;
}

export interface IScanRequest<Service> {
  bill_generated: boolean;
  paid: boolean;
  payment_status: boolean;
  test: Service;
  _id: string;
}
