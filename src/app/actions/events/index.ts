import { AppointmentEvent } from "./appointment";
import { HospitalEvent } from "./hospital";
import { LabEvent } from "./lab";
import { PaymentEvent } from "./payment";
import { PrescriptionEvent } from "./prescription";
import { RadiologyEvent } from "./radiology";
import { TabEvent } from "./tab";

export type SmartMobileEvent =
  | AppointmentEvent
  | HospitalEvent
  | LabEvent
  | PaymentEvent
  | PrescriptionEvent
  | RadiologyEvent
  | TabEvent;
