export interface IService {
  can_edit: boolean;
  custom_fields: [];
  expose_to_patient: boolean;
  hmo_groups: [];
  hmos_and_costs: [];
  hospital_branch_code: string;
  is_custom_service: boolean;
  is_nhis: boolean;
  nhis_cost: number;
  service_category: string;
  service_cost: number;
  service_department_route: string;
  service_name: string;
  service_sub_category: string;
  smart_code: string;
  status: string;
  sub_tests: [];
  time_slots: [];
  validity_in_days: number;
  _id: string;
}

export interface IStoreItem {
  bar_code: string;
  below_reorder: boolean;
  department_route: string;
  drug_class: [];
  expired: string;
  hmo_groups: [];
  hmos_and_costs: [];
  hospital_branch_code: string;
  item_category_name: string;
  item_cost: number;
  item_expiry_date: string;
  item_initial_cost: number;
  item_name: string;
  item_quantity: number;
  item_unit: string;
  reorder_level: number;
  smart_code: string;
  status: boolean;
  total_cost_price: number;
  updated_at: string;
  _id: string;
}

export interface IAPIResponse<T> {
  message: string;
  error: boolean;
  result: T;
  token?: string;
}
