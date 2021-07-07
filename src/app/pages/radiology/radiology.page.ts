import { Component, OnInit } from "@angular/core";
import { LoadRadiologyRequests } from "src/app/actions/events/radiology";
import { RadiologyService } from "src/app/services/radiology.service";
import { Location } from "@angular/common"
import { AlertController } from "@ionic/angular";
import { Store } from "src/app/engine/store";
import { Router } from "@angular/router";
import { PaymentService } from "src/app/services/payment.service";

@Component({
  selector: "app-radiology",
  templateUrl: "./radiology.page.html",
  styleUrls: ["./radiology.page.scss"],
})
export class RadiologyPage implements OnInit {
  storeCtrl = new Store()
  constructor(public rService: RadiologyService, 
    public location: Location,
     public alertCtrl: AlertController,
     public router:Router,
     public _paymentService:PaymentService) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.rService.triggerEvent(LoadRadiologyRequests);
  }

  goBack() {
    this.location.back()
  }

  async fetchWalletBalance() {
    const walletBalance = await this._paymentService.fetchWalletBalance();
  
    return walletBalance;
  }

  async requestResult(item) {
    const walletBalance = await this.fetchWalletBalance();
    if (!walletBalance || walletBalance > 300) {
      const alertCtrl = await this.alertCtrl.create({
        header: `Insufficient Funds`,
        subHeader: ` Currently Wallet Balance ${walletBalance || 0
          } naira.`,
        message: `You must have at least 300 naira in your wallet to request for the ${item.service_name} result.`,

        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: (blah) => { },
          },
          {
            text: "Fund Wallet",
            handler: () => {
              this.router.navigate(["/wallet"], {
                queryParams: {
                  showBack: "yes",
                },
              });
            },
          },
        ],
      });

      await alertCtrl.present();
      return;
    } else {
      const alertCtrl2 = await this.alertCtrl.create({
        header: `Request for ${item.service_name} result`,
        message: `350 units will be deducted from your wallet for this service. <br> To proceed, please enter your preferred email address below`,
        inputs: [
          {
            name: 'name2',
            type: 'email',
            id: 'name2-id',
            value: `${this.storeCtrl.user.email}`,
            // placeholder: `${this.storeCtrl.user.email}`
            attributes: {
              autofocus: true
              //     inputmode: 'decimal'
              //   }
            },
          }


        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Proceed",
            handler: () => { },
          },
        ],
      });

      await alertCtrl2.present();
    }
  }
}
