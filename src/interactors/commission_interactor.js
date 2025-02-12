export default class ComissionInteractor {
  constructor(principal) {
    this.principal = principal;
    this.dpCharge = 25;
    this.oneWayTransferCharge = 10;
  }

  _calculateCommissionPercent() {
    if (this.principal <= 50000) {
      return 0.0036;
    } else if (this.principal > 50000 && this.principal <= 500000) {
      return 0.0033;
    } else if (this.principal > 500000 && this.principal <= 2000000) {
      return 0.0031;
    } else if (this.principal > 2000000 && this.principal <= 10000000) {
      return 0.0027;
    } else {
      return 0.0024;
    }
  }

  calculateBrokerage() {
    let commissionPercent = this._calculateCommissionPercent();
    return commissionPercent * this.principal;
  }

  calculateSebonFee() {
    return 0.00015 * this.principal;
  }
}
