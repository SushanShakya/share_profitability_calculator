import BuyPriceInteractor from "./buy_price_interactor.js";
import ComissionInteractor from "./commission_interactor.js";

export default class SellPriceInteractor {
  constructor(principal) {
    this.comissionInteractor = new ComissionInteractor(principal);
    this.principal = principal;
    this.dpCharges = this.comissionInteractor.dpCharge;
    this.oneWayTransferFees = this.comissionInteractor.oneWayTransferCharge;
  }

  computeSellPrice() {
    let brokerage = this.comissionInteractor.calculateBrokerage();
    let sebonFee = this.comissionInteractor.calculateSebonFee();

    return this.principal - brokerage - sebonFee - this.dpCharges;
  }

  calculateProfit(cp, sp) {
    return sp - cp;
  }

  calculateCapitalGainsTax(profit) {
    if (profit <= 0) return 0;
    return 0.075 * profit;
  }

  computeReceivableAmount(buyAmountAfterCharges) {
    let amountAfterFees = this.computeSellPrice();
    let intermediateProfit = this.calculateProfit(
      buyAmountAfterCharges,
      amountAfterFees
    );
    let capitalGainsTax = this.calculateCapitalGainsTax(intermediateProfit);
    return amountAfterFees - capitalGainsTax - this.oneWayTransferFees;
  }
}
