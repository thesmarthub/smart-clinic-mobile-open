export type ApiAction =
  | "FETCH_PATIENT_PROFILE"
  | "FETCH_PATIENT_PRESCRIPTIONS"
  | "FETCH_PATIENT_LAB_REQUESTS"
  | "FETCH_PATIENT_RADIOLOGY_REQUESTS"
  | "FETCH_PATIENT_APPOINTMENTS"
  | "CREATE_APPOINTMENT"
  | "UPDATE_APPOINTMENT"
  | "FETCH_TIME_SLOTS"
  | "FETCH_PATIENT_BILLS"
  | "ADD_TX_REF_TO_BILLS"
  | "CONFIRM_PAYMENT"
  | "MAKE_SERVICE_REQUEST"
  | "VIEW_SERVICE_REQUESTS"
  | "REGISTER_PATIENT"
  | "VIEW_AVAILABLE_SERVICES"
  | "VIEW_AVAILABLE_SPECIALISTS";