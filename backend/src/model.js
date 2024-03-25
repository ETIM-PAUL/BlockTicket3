class CompanyShares {
  static curr_id = 0;
  id;
  companyName;
  description;
  companyAdminAddress;
  companyLogo;
  totalShares;
  pricePerShare;
  minShare;
  country;
  state;
  regNum;
  status;
  // static curr_id: number = 0;
  shareHolders;
  constructor(
    companyName,
    description,
    companyAdminAddress,
    companyLogo,
    pricePerShare,
    minShare,
    country,
    state,
    regNum
  ) {
    this.status = 0;
    if (CompanyShares.curr_id) {
      this.id = CompanyShares.curr_id++;
    } else {
      CompanyShares.curr_id = 1;
      this.id = 1;
    }
    this.companyName = companyName;
    this.description = description;
    this.companyAdminAddress = companyAdminAddress;
    this.companyLogo = companyLogo;
    this.minShare = minShare;
    this.pricePerShare = pricePerShare;
    this.country = country;
    this.state = state;
    this.regNum = regNum;
    this.shareHolders = [];
  }
  getId() {
    return this.id;
  }
  getName() {
    return this.companyName;
  }
  getDescription() {
    return this.description;
  }
  getCompanyAdmin() {
    return this.companyAdminAddress;
  }
  getCompanyLogo() {
    return this.companyLogo;
  }
  getMinShare() {
    return this.minShare;
  }
  getPriceShare() {
    return this.pricePerShare;
  }
  getCountry() {
    return this.country;
  }
  getState() {
    return this.state;
  }
  getStatus() {
    return this.status;
  }
  getCompanyReg() {
    return this.regNum;
  }
  getShareHolders() {
    return this.shareHolders;
  }

  acquisition(acquisition) {
    if (acquisition.company_id != this.id) {
      throw new EvalError(`Company id ${acquisition.company_id} does not match`);
    }
    if (this.status == 0) {
      throw new EvalError("This company isn't active");
    }
    if (acquisition.amount_of_shares < this.minShare) {
      throw new EvalError(
        `Acquisition shares ${acquisition.minShare} did not not meet minimum shares`
      );
    }
    if (acquisition.amount < (this.pricePerShare * acquisition.amount_of_shares)) {
      throw new EvalError(
        `Acquisition amount ${acquisition.amount} did not not meet total price`
      );
    }

    // Check if an object with the given name already exists
    const existingObjectIndex = this.shareHolders.findIndex(obj => obj.msg_sender.toLowerCase() === acquisition?.msg_sender.toLowerCase());

    if (existingObjectIndex !== -1) {
      // If the object exists, update the amount
      this.shareHolders[existingObjectIndex].amount_of_shares += acquisition?.amount_of_shares;
    } else {
      // If the object doesn't exist, add a new object
      this.shareHolders.push(acquisition);
    }
  }

  acquisition_withdraw(msg_sender, company_id, amount) {
    if (company_id != this.id) {
      throw new EvalError(`Company id ${company_id} does not match`);
    }
    if (this.status == 0) {
      throw new EvalError("This company isn't active");
    }

    // Check if an object with the given name already exists
    const existingObjectIndex = this.shareHolders.findIndex(obj => obj.msg_sender.toLowerCase() === msg_sender.toLowerCase());

    if (existingObjectIndex !== -1) {
      if (this.shareHolders[existingObjectIndex].amount_of_shares < amount) {
        // If the object doesn't exist, add a new object
        throw new EvalError("Insufficient shares amount");
      }
      // If the object exists, update the amount
      this.shareHolders[existingObjectIndex].amount_of_shares -= amount;
    } else {
      // If the object doesn't exist, add a new object
      throw new EvalError("No shares in this company");
    }

    this.shareHolders.push(acquisition);
  }
}

export { CompanyShares };