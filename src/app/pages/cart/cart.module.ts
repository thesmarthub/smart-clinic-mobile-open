import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CartPageRoutingModule } from "./cart-routing.module";

import { CartPage } from "./cart.page";
import { FlutterwavePageModule } from "../flutterwave/flutterwave.module";
import { SharedModule } from "src/app/shared/shared.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPageRoutingModule,
    FlutterwavePageModule,
    SharedModule
  ],
  declarations: [CartPage],
})
export class CartPageModule {}
