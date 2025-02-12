import BuyPriceInteractor from "./buy_price_interactor.js";
import SellPriceInteractor from "./sell_price_interactor.js";

export default class PointOfProfitabilityInteractor {
  constructor(buyPrice, n) {
    this.buyPrice = buyPrice;
    this.n = n;

    this.bI = new BuyPriceInteractor(this.principal());
  }

  principal() {
    return this.buyPrice * this.n;
  }

  amountRequired() {
    return this.bI.calculateAmountRequiredToBuy();
  }

  calculatePointofProfitability(expectedProfit) {
    let buyAmountAfterCharges = this.bI.calculateBuyPrice();
    let actualBuyAmount = this.bI.calculateAmountRequiredToBuy();
    let priceAcc = this.buyPrice;
    let isProfit = false;
    while (!isProfit) {
      priceAcc++;
      let principal = priceAcc * this.n;
      let sI = new SellPriceInteractor(principal);
      let actualReceivable = sI.computeReceivableAmount(buyAmountAfterCharges);
      let profitIncured = actualReceivable - actualBuyAmount;
      isProfit = profitIncured >= expectedProfit;
    }

    return priceAcc;
  }
}
