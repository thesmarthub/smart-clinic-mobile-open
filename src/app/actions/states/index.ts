import { AppointmentState } from "./appointment";
import { HospitalState } from "./hospital";
import { LabState } from "./lab";
import { PaymentState } from "./payment";
import { PrescriptionState } from "./prescription";
import { RadiologyState } from "./radiology";
import { TabState } from "./tab";

export type SmartMobileState =
  | AppointmentState
  | HospitalState
  | LabState
  | PaymentState
  | PrescriptionState
  | RadiologyState
  | TabState;
