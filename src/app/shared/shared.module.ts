import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WalletChargeDirective } from "./wallet-charge.directive";
import { ColorizeDirective } from "./colorize.directive";

@NgModule({
  declarations: [WalletChargeDirective, ColorizeDirective],
  imports: [CommonModule],
  exports: [WalletChargeDirective, ColorizeDirective],
  providers: [WalletChargeDirective, ColorizeDirective],
})
export class SharedModule {}
