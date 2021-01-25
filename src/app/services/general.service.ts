import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ApiAction } from "src/interfaces/action";
import { IAPIResponse } from "src/interfaces/general";
import { environment } from "../../environments/environment";
import { LabEvent } from "../actions/events/lab";
import { PrescriptionEvent } from "../actions/events/prescription";

@Injectable({
  providedIn: "root",
})
export class GeneralService {
  baseUrl = environment.baseURL;
  broadcaster = new BehaviorSubject<{
    res: APIResp;
    action: PrescriptionEvent | LabEvent;
    failed: boolean;
  }>(null);
  constructor(public http: HttpClient) {}

  postData = ({ url, data, action }: RequestRequirements) => {
    this.http.post(`${this.baseUrl}${url}`, data).subscribe(
      (res: APIResp) => {
        this.broadcaster.next({ res: res, action, failed: false });
      },
      (error) => {
        this.broadcaster.next({ res: error, action, failed: true });
      }
    );
  };

  getData = ({ url, params, action }: RequestRequirements) => {
    this.http.get(`${this.baseUrl}${url}`, { params }).subscribe(
      (res: APIResp) => {
        console.log(res);
        this.broadcaster.next({ res: res, action, failed: false });
      },
      (error) => {
        this.broadcaster.next({ res: error, action, failed: true });
      }
    );
  };

  updateData = ({ url, data, action }: RequestRequirements) => {
    this.http.put(`${this.baseUrl}${url}`, data).subscribe(
      (res: APIResp) => {
        this.broadcaster.next({ res: res, action, failed: false });
      },
      (error) => {
        this.broadcaster.next({ res: error, action, failed: true });
      }
    );
  };

  deleteData = ({ url, params, action }: RequestRequirements) => {
    this.http.delete(`${this.baseUrl}${url}`, params).subscribe(
      (res: APIResp) => {
        this.broadcaster.next({ res: res, action, failed: false });
      },
      (error) => {
        this.broadcaster.next({ res: error, action, failed: true });
      }
    );
  };
}

interface RequestRequirements {
  url: string;
  params?: Record<string, ApiAction | string>;
  data?: Record<string, any> | any[];
  action: PrescriptionEvent | LabEvent;
}

type APIResp = IAPIResponse<Record<string, any> | Record<string, any>[]>;
