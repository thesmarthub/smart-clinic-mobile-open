// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseURL: "https://health.smartapps.com.ng/mobile/", 
  // baseURL: "http://172.24.23.144:7003",
  mobileEventUrl: "https://events.s3.smartapps.com.ng/",
  orgsURL: "http://localhost:8080/api/v1/",
  // emrUrl:"http://localhost:8000/v1/"
    emrUrl:"https://s3.smartapps.com.ng/v1/"

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
