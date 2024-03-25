class Balance {
  account;
  ether;
  _erc721;
  constructor(
    account,
    ether,
    erc721
  ) {
    this.account = account;
    this._erc721 = erc721;
    this.ether = ether;
  }
  ether_get() {
    return this.ether;
  }

  ether_increase(amount) {
    if (amount < 0) {
      throw new Error(
        `failed to increase balance of ether for ${this.account}`
      );
      return;
    }
    this.ether = this.ether + amount;
  }

  ether_decrease(amount) {
    if (amount < 0) {
      throw new Error(
        `failed to decrease balance of ether for ${this.account}`
      );
    }

    if (this.ether < amount) {
      throw new Error(`failed to decrease balancefor ${this.account}`);
      return;
    }
    this.ether = this.ether - amount;
  }
}

export { Balance };