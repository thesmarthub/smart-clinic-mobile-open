import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ModalController } from "@ionic/angular";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { FetchBills } from "src/app/actions/events/payment";
import { CartService } from "src/app/services/cart.service";
import { PaymentService } from "src/app/services/payment.service";
import { ApiAction } from "src/interfaces/action";
import { CartPage } from "../cart/cart.page";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.page.html",
  styleUrls: ["./payment.page.scss"],
})
export class PaymentPage implements OnInit {
  cart = [];
  products = [];
  cartItemCount;
  subs: Subscription[] = [];
  @ViewChild("cart", { static: false, read: ElementRef }) fab: ElementRef;
  constructor(
    public pService: PaymentService,
    public cartService: CartService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ionViewDidEnter() {
    this.fetchBills();
  }

  loadData() {
    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();
    const billsSub = this.pService.currentValues.pendingBills.subscribe(
      (bills) => {
        this.products = bills.map((element) => {
          console.log(
            "refreshing",
            element.id,
            this.cartService.productIsInCart(element?.id)
          );
          if (this.cartService.productIsInCart(element?.id)) {
            element.isInCart = true;
          } else {
            element.isInCart = false;
          }
          return element;
        });
      }
    );
    this.subs.push(billsSub);
  }

  fetchBills() {
    const action: ApiAction = "FETCH_PATIENT_BILLS";
    this.pService.triggerEvent(FetchBills, {
      action,
      start_date: moment().subtract(3, "months").toDate(),
    });
  }

  unsub() {
    this.subs.forEach((sub) => {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    });
  }

  updateCart(product) {
    if (!product.isInCart) {
      product.isInCart = true;
      this.cartService.addProduct(product);
      // this.pService.currentValues.pendingBills.next(this.products);
    } else {
      product.isInCart = false;
      this.cartService.removeProduct(product);
      // this.pService.currentValues.pendingBills.next(this.products);
    }

    this.animateCSS("tada");
  }

  async openCart() {
    this.animateCSS("bounceOutLeft", true);

    let modal = await this.modalCtrl.create({
      component: CartPage,
      cssClass: "cart-modal",
    });
    modal.onWillDismiss().then(() => {
      this.fab.nativeElement.classList.remove("animated", "bounceOutLeft");
      this.animateCSS("bounceInLeft");
    });
    modal.present();

    modal.onDidDismiss().then((res) => {
      if (res.data?.reload === true) {
        this.cartItemCount = 0;
        this.unsub();
        this.loadData();
        this.fetchBills();
      }
    });
  }

  animateCSS(animationName, keepAnimated = false) {
    const node = this.fab.nativeElement;
    node.classList.add("animated", animationName);

    //https://github.com/daneden/animate.css
    function handleAnimationEnd() {
      if (!keepAnimated) {
        node.classList.remove("animated", animationName);
      }
      node.removeEventListener("animationend", handleAnimationEnd);
    }
    node.addEventListener("animationend", handleAnimationEnd);
  }
}
