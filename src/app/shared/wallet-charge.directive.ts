import { Directive } from "@angular/core";
import { AlertController, LoadingController } from "@ionic/angular";
import { PaymentService } from "../services/payment.service";

@Directive({
  selector: "[appWalletCharge]",
})
export class WalletChargeDirective {
  constructor(
    private _alertCtrl: AlertController,
    private _paymentService: PaymentService,
    private _loadingCtrl: LoadingController
  ) {}

  async runMe({
    callBack,
    amount,
    title,
  }: {
    callBack?: successCallback;
    amount: number;
    title?: string;
  }) {
    const loader = await this.loading();

    const walletBalance = await this._paymentService.fetchWalletBalance();

    if (!title) title = `Your wallet balance is ${walletBalance}`;

    loader.dismiss();

    let alertMessage = `${amount} units will be deducted from your wallet for this transaction. <br> Do you want to proceed?`;

    if (!amount) alertMessage = "Amount cannot be empty";

    if (amount + 50 > walletBalance) {
      alertMessage = "Insufficient funds";
      callBack = () => {};
    }

    const alertCtrl = await this._alertCtrl.create({
      header: title,
      message: alertMessage,
      buttons: [
        {
          text: "Yes",
          role: "cancel",
          cssClass: "secondary",
          handler: callBack ? callBack : () => {},
        },
        {
          text: "No",
          handler: () => {
            alertCtrl.dismiss();
          },
        },
      ],
    });
    alertCtrl.present();
  }

  async loading() {
    const loader = await this._loadingCtrl.create();
    loader.present();

    return loader;
  }
}

type successCallback = (value: any) => boolean | void | Record<string, any>;
