import ComissionInteractor from "./commission_interactor.js";

export default class BuyPriceInteractor {
  constructor(principal) {
    this.principal = principal;
    this.interactor = new ComissionInteractor(this.principal);
    this.dpCharges = this.interactor.dpCharge;
    this.oneWayTransferFees = this.interactor.oneWayTransferCharge;
  }

  calculateBuyPrice() {
    let brokerage = this.interactor.calculateBrokerage();
    let sebonFee = this.interactor.calculateSebonFee();

    return this.principal + brokerage + sebonFee + this.dpCharges;
  }

  calculateAmountRequiredToBuy() {
    let amountAfterFees = this.calculateBuyPrice();
    return amountAfterFees + this.oneWayTransferFees;
  }
}
