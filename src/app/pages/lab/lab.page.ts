import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadLabRequests } from 'src/app/actions/events/lab';
import { LoadedLabRequests } from 'src/app/actions/states/lab';
import { LabService } from 'src/app/services/lab.service';
import { AlertController } from '@ionic/angular';
import { Store } from 'src/app/engine/store';
import { PaymentService } from 'src/app/services/payment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.page.html',
  styleUrls: ['./lab.page.scss'],
})
export class LabPage implements OnInit {
  storeCtrl = new Store()

  constructor(
    public lService: LabService, 
    public location: Location, 
    public alertCtrl:AlertController,
    public _paymentService: PaymentService,
    public router: Router) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.lService.triggerEvent(LoadLabRequests)
  }
  send(){
    
  }

  goBack(){
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
        subHeader: ` Currently Wallet Balance ${
          walletBalance || 0
        } naira.`,
        message:`You must have at least 300 naira in your wallet to request for the ${item.service_name} result.`,
    
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: (blah) => {},
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
              autofocus:true
              //     inputmode: 'decimal'
              //   }
          },}
       
   
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Send",
            handler: () => {
              // console.log(item)
              let data = {
                url:"/smart-patient/fetch-lab-results",
                data:[item?.appointment]
              }
              this.lService.sendLabResults(data)

            },
          },
        ],
      });

      await alertCtrl2.present();
    }

    // if (!number) number = this.store.currentHospital.phone1;
    // this.callNumber
    //   .callNumber(number, true)
    //   .then((res) => console.log("Launched dialer!", res))
    //   .catch((err) => console.log("Error launching dialer", err));
  }

}
