import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appColorize]",
})
export class ColorizeDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.style.color = "purple";
  }
}
