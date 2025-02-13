class BuyPriceInteractor {
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

class ComissionInteractor {
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
class ExpectedProfitabilityInteractor {
  constructor(buyPrice, n, expectedSellPrice) {
    this.buyPrice = buyPrice;
    this.n = n;
    this.expectedSellPrice = expectedSellPrice;
    this.bI = new BuyPriceInteractor(this.buyPrincipal());
  }

  buyPrincipal() {
    return this.buyPrice * this.n;
  }

  receivableAmount() {
    let buyAmountAfterCharges = this.bI.calculateBuyPrice();
    let sI = new SellPriceInteractor(this.expectedSellPrice * this.n);
    return sI.computeReceivableAmount(buyAmountAfterCharges);
  }

  computeExpectedProfits() {
    let buyAmount = this.bI.calculateAmountRequiredToBuy();
    let sellPrice = this.receivableAmount();

    return sellPrice - buyAmount;
  }

  computeROI() {
    let profits = this.computeExpectedProfits(this.expectedSellPrice);
    let buyAmount = this.bI.calculateAmountRequiredToBuy();
    return profits / buyAmount;
  }
}

class PointOfProfitabilityInteractor {
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

class SellPriceInteractor {
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

let defaultProfitExpected = 100;

// Create floating box
// Create floating box
const floatingBox = document.createElement("div");
floatingBox.id = "floating-box";
floatingBox.innerHTML = `
  <div id="minimize-btn">
    <h3>Share Price Calculator</h3>
    <span>🔽</span>
  </div>
  <div id="floating-content">
    <label for="current-share-price">Current Share Price</label>
    <input type="number" id="current-share-price" value="500" />

    <label for="kitta">No of Kitta</label>
    <input type="number" id="kitta" value="100" />

    <label for="expected-share-price">Expected Share Price</label>
    <input type="number" id="expected-share-price" value="600" />

    <button id="calculate-button">Calculate</button>
    <p id="result"></p>
  </div>
`;

// Append to body
document.body.appendChild(floatingBox);

// Minimize button functionality
document.getElementById("minimize-btn").addEventListener("click", () => {
  floatingBox.classList.toggle("collapsed");
  localStorage.setItem(
    "floatingBoxCollapsed",
    floatingBox.classList.contains("collapsed")
  );
});

// Load previous minimized state
if (localStorage.getItem("floatingBoxCollapsed") === "true") {
  floatingBox.classList.add("collapsed");
}

// Add event listener for the Calculate button
document
  .getElementById("calculate-button")
  .addEventListener("click", onCalculateClick);

function onCalculateClick() {
  const currentSharePrice = parseFloat(
    document.getElementById("current-share-price").value
  );
  const noOfShares = parseInt(document.getElementById("kitta").value);
  const expectedSharePrice = parseFloat(
    document.getElementById("expected-share-price").value
  );
  calculate(currentSharePrice, noOfShares, expectedSharePrice);
}

function outputToDocument(
  buyPrice,
  sellSharePrice,
  expectedSellPrice,
  expectedProfit,
  roi,
  receivableAmount
) {
  let cs = expectedProfit >= 0 ? "profit" : "loss";
  document.getElementById("result").innerHTML = `
  <div>
      <b>Buy Amount</b>: <span class="profit"> Rs. ${buyPrice}</span><br>
      <b>Stock Profitable at</b>: <span class="profit">Rs. ${sellSharePrice}</span> <br>
      <hr style="border-top: 1px solid white;">
      When sold at <span class="profit">${expectedSellPrice}</span><br>
      <b>Expected Profit</b>: <span class="${cs}">Rs. ${expectedProfit.toFixed(
    2
  )}</span><br>
      <b>ROI</b>: <span class="${cs}">${roi.toFixed(2)}%</span><br>
      <b>Receivable Amount</b>: <span class="profit"> Rs. ${receivableAmount.toFixed(
        2
      )}</span><br>
  </div>
  `;
}

function outputToConsole(
  noOfShares,
  currentSharePrice,
  buyPrice,
  sellSharePrice,
  expectedSellPrice,
  expectedProfit,
  roi
) {
  console.log(`No of shares: ${noOfShares}`);
  console.log(`Current Share Price: ${currentSharePrice}`);
  console.log(`Buy Amount : Rs ${buyPrice}`);
  console.log(`Stock Profitable at : Rs ${sellSharePrice}`);
  console.log();
  console.log(`Expected Share Price: ${expectedSellPrice}`);
  console.log(`Expected Profit: ${expectedProfit}`);
  console.log(`ROI: ${roi}%`);
}

function calculate(currentSharePrice, noOfShares, expectedSellPrice) {
  let i = new PointOfProfitabilityInteractor(currentSharePrice, noOfShares);
  let sellSharePrice = i.calculatePointofProfitability(defaultProfitExpected);
  let buyPrice = i.amountRequired();

  let i2 = new ExpectedProfitabilityInteractor(
    currentSharePrice,
    noOfShares,
    expectedSellPrice
  );

  let expectedProfit = i2.computeExpectedProfits();
  let roi = i2.computeROI() * 100;
  let receivableAmount = i2.receivableAmount();

  outputToDocument(
    buyPrice,
    sellSharePrice,
    expectedSellPrice,
    expectedProfit,
    roi,
    receivableAmount
  );

  outputToConsole(
    noOfShares,
    currentSharePrice,
    buyPrice,
    sellSharePrice,
    expectedSellPrice,
    expectedProfit,
    roi
  );
}

// calculate(100, 100, 100);
