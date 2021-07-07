import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DoctorsPageRoutingModule } from "./doctors-routing.module";

import { DoctorsPage } from "./doctors.page";

import { CallNumber } from "@ionic-native/call-number/ngx";

import { CometChatUI } from "../../../cometchat-pro-angular-ui-kit/CometChatWorkspace/projects/angular-chat-ui-kit/src/components/CometChatUI/CometChat-Ui/cometchat-ui.module";

@NgModule({
  imports: [
    CometChatUI,
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorsPageRoutingModule,
  ],
  declarations: [DoctorsPage],
  providers: [CallNumber],
})
export class DoctorsPageModule {}
