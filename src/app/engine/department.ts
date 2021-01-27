import { Store } from "./store";

export const departments = (store: Store) => {
  return store.currentHospital.departments;
};

export const departmentByRoute = ({
  store,
  route,
}: {
  store: Store;
  route: string;
}) => {
  return store.currentHospital.departments.find((dept) => dept.route === route);
};
