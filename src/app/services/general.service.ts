import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { ApiAction } from "src/interfaces/action";
import { API } from "src/interfaces/api";
import { IAPIResponse } from "src/interfaces/general";
import { environment } from "../../environments/environment";
import { SmartMobileEvent } from "../actions/events";

@Injectable({
  providedIn: "root",
})
export class GeneralService {
  baseUrl = environment.baseURL;
  broadcaster = new BehaviorSubject<{
    res: APIResp;
    action: SmartMobileEvent;
    failed: boolean;
  }>(null);
  constructor(
    public http: HttpClient,
    private loadingController: LoadingController
  ) {}

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

  getData = async ({
    url,
    params,
    action,
    requestMode,
  }: RequestRequirements) => {
    if (!requestMode) {
      requestMode = "async";
    }
    if (requestMode === "async") {
      this.http.get(`${this.baseUrl}${url}`, { params }).subscribe(
        (res: APIResp) => {
          console.log(res);
          this.broadcaster.next({ res: res, action, failed: false });
        },
        (error) => {
          this.broadcaster.next({ res: error, action, failed: true });
        }
      );
    } else {
      return await this.http
        .get(`${this.baseUrl}${url}`, { params })
        .toPromise()
        .then((data) => data);
    }
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

  async presentLoading(conf) {
    console.log(conf)
    if (conf.currentEvent === conf.expectedEvent) {
      if (conf.loader) {
        await conf.loader.dismiss();
      }
      conf.loader = await this.loadingController.create({
        message: conf.message,
        spinner: "bubbles",
      });
      await conf.loader.present();
    } else if (conf.loader) {
      await conf.loader.dismiss();
    }
  }
}

interface RequestRequirements {
  url: API;
  params?: Record<string, ApiAction | string>;
  data?: Record<string, any> | any[];
  action: SmartMobileEvent;
  requestMode?: "async" | "sync";
}

type APIResp = IAPIResponse<Record<string, any> | Record<string, any>[]>;
