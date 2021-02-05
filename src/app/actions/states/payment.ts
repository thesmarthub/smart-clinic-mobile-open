export abstract class PaymentState {}

export class FetchingBills extends PaymentState {}

export class FetchedBills extends PaymentState {}

export class InitiatingPayment extends PaymentState {}

export class InitiatedPayment extends PaymentState {}


