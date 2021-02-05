export abstract class PaymentEvent {}

export class FetchBills extends PaymentEvent {}

export class AddToCart extends PaymentEvent {
  constructor(private cartItem) {
    super();
  }
}

export class RemoveFromCart extends PaymentEvent {
  constructor(private index: number) {
    super();
  }
}

export class InitiatePayment extends PaymentEvent {
  constructor(private billItems) {
    super();
  }
}

export class VerifyPayment extends PaymentEvent {
  constructor(private paymentRef) {
    super();
  }
}
