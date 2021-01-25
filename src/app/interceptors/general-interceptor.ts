import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "../engine/store";

@Injectable()
export class GeneralInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // All HTTP requests are going to go through this method
    const store = new Store();
    const duplicate = req.clone({
      setParams: {
        action: req.params.get("action"),
        token: store.token,
        hospital_smart_code:
          req.params.get("use_temp_hosp") === "yes"
            ? store.tempHospital?.smart_code
            : store.currentHospital?.smart_code,
        patient_smart_code: store.user?.smart_code,
        hospital_number: store.user?.hospital_number,
      },
    });
    return next.handle(duplicate);
  }
}
