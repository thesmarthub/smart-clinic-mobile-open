import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MenuController } from "@ionic/angular";
import { OpenMenu, TabEvent } from "../actions/events/tab";
import { TabsService } from "../services/tabs.service";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage {
  openMenu = OpenMenu;
  constructor(private menu: MenuController, private tService: TabsService, private router:Router) {
    this.tService.currentValues.menuAction.subscribe((action) => {
      if (action === "open") {
        this.openCustom();
      } else if (action === "close") {
        this.closeCustom();
      }
    });
  }


  eventTrigger(event: TabEvent) {
    this.tService.triggerEvent(event)
  }

  ngOnDestroy() {
    console.log("Tabs destroyed");
  }
  // openFirst() {
  //   this.menu.enable(true, 'first');
  //   this.menu.open('first');
  // }

  // openEnd() {
  //   this.menu.open('end');
  // }

  openCustom() {
    this.menu.enable(true, "custom");
    this.menu.open("custom");
  }

  closeCustom() {
    this.menu.close("custom");
  }

  openBills(){
    this.router.navigate(['/tabs/payment'], {queryParams:{'department_route':''}})
  }
}
