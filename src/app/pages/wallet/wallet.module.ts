import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletPageRoutingModule } from './wallet-routing.module';

import { WalletPage } from './wallet.page';
import { FlutterwavePageModule } from '../flutterwave/flutterwave.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { WalletChargeDirective } from 'src/app/shared/wallet-charge.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletPageRoutingModule,
    FlutterwavePageModule,
    SharedModule
  ],
  declarations: [WalletPage],
  // providers: [WalletChargeDirective]
})
export class WalletPageModule {}
