import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModalController } from "@ionic/angular";
import * as moment from "moment";
import { BehaviorSubject, Subscription } from "rxjs";
import { FetchBills } from "src/app/actions/events/payment";
import { CartService } from "src/app/services/cart.service";
import { PaymentService } from "src/app/services/payment.service";
import { ApiAction } from "src/interfaces/action";
import { CartPage } from "../cart/cart.page";
import { Location } from "@angular/common"


@Component({
  selector: "app-payment",
  templateUrl: "./payment.page.html",
  styleUrls: ["./payment.page.scss"],
})
export class PaymentPage implements OnInit {
  cart = [];
  products = [];
  walletBalance: number;
  cartItemCount: BehaviorSubject<number>;
  subs: Subscription[] = [];
  billType;
  @ViewChild("cart", { static: false, read: ElementRef }) fab: ElementRef;
  constructor(
    public pService: PaymentService,
    public cartService: CartService,
    public aRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    public location: Location
    // private badge: Badge
  ) {
    this.aRoute.queryParams.subscribe((data) => {
      if (data?.department_route) {
        this.pService.departmentRoute = data.department_route
      } else {
        this.pService.departmentRoute = null
      }
    });
  }

  ngOnInit() {
    this.loadData();
  }

  ionViewDidEnter() {
    this.fetchWalletBalance();
    this.fetchBills();
  }

  ionViewDidLeave() {
    this.pService.departmentRoute = null;
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

  async fetchWalletBalance() {
    console.log("fetching wallet balance");

    const walletBalance = await this.pService.fetchWalletBalance();
    if (typeof walletBalance !== "boolean") {
      this.walletBalance = walletBalance;
    }
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
        this.cartItemCount?.next(0);
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

  goBack(){
    this.location.back()
  }
}
