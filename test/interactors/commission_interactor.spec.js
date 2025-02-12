import ComissionInteractor from "../../src/interactors/commission_interactor";

test("Brokerage", () => {
  let n = 100;
  let testdata = [
    [500, 18],
    [600, 198],
    [7000, 2170],
    [90000, 24300],
  ];

  for (var a of testdata) {
    let sharePrice = a[0];
    let expected = a[1];
    let interactor = new ComissionInteractor(sharePrice * n);
    let brokerage = interactor.calculateBrokerage();

    expect(brokerage).toBe(expected);
  }
});
