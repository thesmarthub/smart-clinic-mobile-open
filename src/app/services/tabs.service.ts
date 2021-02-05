import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CloseMenu, OpenMenu, TabEvent } from "../actions/events/tab";

@Injectable({
  providedIn: "root",
})
export class TabsService {
  currentValues = {
    menuAction: new BehaviorSubject<"open" | "close">(null),
  };
  constructor() {}

  triggerEvent(event: TabEvent, value?: any) {
    if (event === OpenMenu) {
      this.currentValues.menuAction.next("open");
    }
    if (event === CloseMenu) {
      this.currentValues.menuAction.next("close");
    }
  }
}
