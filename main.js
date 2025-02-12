import {
  ExpectedProfitabilityInteractor,
  PointOfProfitabilityInteractor,
  SellPriceInteractor,
} from "./src/interactors/index.js";

let currentSharePrice = 600;
let noOfShares = 100;

let i = new PointOfProfitabilityInteractor(currentSharePrice, noOfShares);
let profitExpected = 100;
let sellSharePrice = i.calculatePointofProfitability(profitExpected);
let buyPrice = i.amountRequired();

console.log(`No of shares: ${noOfShares}`);
console.log(`Current Share Price: ${currentSharePrice}`);
console.log(`Buy Amount : Rs ${buyPrice}`);
console.log(`Min. Bound for Stock Profitability : Rs ${sellSharePrice}`);

let expectedSellPrice = 700;
let i2 = new ExpectedProfitabilityInteractor(
  currentSharePrice,
  noOfShares,
  expectedSellPrice
);

let expectedProfit = i2.computeExpectedProfits();
let roi = i2.computeROI();

console.log();
console.log(`Expected Share Price: ${expectedSellPrice}`);
console.log(`Expected Profit: ${expectedProfit}`);
console.log(`ROI: ${roi * 100}%`);
