import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { ApiAction } from "src/interfaces/action";
import { API } from "src/interfaces/api";
import { IAPIResponse } from "src/interfaces/general";
import { environment } from "../../environments/environment";
import { SmartMobileEvent } from "../actions/events";
import { ToastController } from '@ionic/angular';
import { async } from "@angular/core/testing";


@Injectable({
  providedIn: "root",
})
export class GeneralService {
  baseUrl = environment.baseURL;
  nodeUrl = environment.emrUrl;
  broadcaster = new BehaviorSubject<{
    res: APIResp;
    action: SmartMobileEvent;
    failed: boolean;
  }>(null);
  constructor(
    public http: HttpClient,
    private loadingController: LoadingController,
    public toastController: ToastController
  ) {}

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }
  

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

  postDataNodeBackend =  ({ url, data, action }: RequestRequirements) => {
    this.http.post(`${this.nodeUrl}${url}`, data).subscribe(
     async (res: APIResp)  => {
        // this.broadcaster.next({ res: res, action, failed: false });
        console.log(res) 
        if(res.error === false) {
          const toast = await this.toastController.create({
            message: 'operation successful',
            position: 'top',
            buttons: [
              {
  
                handler: () => {
                  console.log('Favorite clicked');
                }
              }, {
                text: 'Done',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }
            ]
          });
          await toast.present();
        }
       
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

  presentLoading = async (
    conf: { message: string; loader?: HTMLIonLoadingElement },
    action?: "open" | "close"
  ) => {
    const createLoader = async () => {
      return this.loadingController.create({
        message: conf.message,
        spinner: "bubbles",
      });
    };
    if (!conf.loader) {
      conf.loader = await createLoader();
    }
    if (action) {
      switch (action) {
        case "open":
          conf.loader.present();
          setTimeout(() => {
            if (conf.loader?.isConnected) {
              conf.loader.dismiss();
            }
          }, 30000);

          break;

        default:
          await conf.loader.dismiss();
          conf = { message: "" };
          break;
      }
      return;
    }

    // if (conf.currentEvent === conf.expectedEvent) {
    //   if (conf.loader) {
    //     await conf.loader.dismiss();
    //   }
    //   conf.loader = await createLoader();
    //   await conf.loader.present();
    //   setTimeout(() => {
    //     if (conf.loader?.isConnected) {
    //       conf.loader.dismiss();
    //     }
    //   }, 30000);
    // } else if (conf.loader) {
    //   await conf.loader.dismiss();
    // }
  };

  resetQueryParams(router: Router, route: ActivatedRoute) {
    router.navigate(["."], { relativeTo: route, queryParams: {} });
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
