import BuyPriceInteractor from "./buy_price_interactor.js";
import SellPriceInteractor from "./sell_price_interactor.js";

export default class ExpectedProfitabilityInteractor {
  constructor(buyPrice, n, expectedSellPrice) {
    this.buyPrice = buyPrice;
    this.n = n;
    this.expectedSellPrice = expectedSellPrice;
    this.bI = new BuyPriceInteractor(this.buyPrincipal());
  }

  buyPrincipal() {
    return this.buyPrice * this.n;
  }

  computeExpectedProfits() {
    let sI = new SellPriceInteractor(this.expectedSellPrice * this.n);
    let buyAmountAfterCharges = this.bI.calculateBuyPrice();
    let buyAmount = this.bI.calculateAmountRequiredToBuy();
    let sellPrice = sI.computeReceivableAmount(buyAmountAfterCharges);

    return sellPrice - buyAmount;
  }

  computeROI() {
    let profits = this.computeExpectedProfits(this.expectedSellPrice);
    let buyAmount = this.bI.calculateAmountRequiredToBuy();
    return profits / buyAmount;
  }
}
