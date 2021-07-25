import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class LoadersService {
  constructor(public loadingController: LoadingController) {}

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Please wait...",
      duration: 5000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log("Loading dismissed!");
  }

  async presentLoadingWithOptions(message) {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message:message,
      translucent: true,
      cssClass: "custom-class custom-loading",
      backdropDismiss: true,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log("Loading dismissed with role:", role);
  }

  async dismissLoader(){
    const dismiss = await this.loadingController.dismiss().then((resp)=>{
      console.log("removed", resp);
    }).catch((err) => {
        console.log('Error occured : ', err);
    });
  }
}
