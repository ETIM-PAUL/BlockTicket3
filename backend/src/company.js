
import { getAddress } from 'viem'
import { Wallet } from "./wallet.js";
import { Error_out, Log, Notice, Output } from "./outputs.js";
import { CompanyShares } from "./model.js";

let companies = new Map();
let defiVestAdmins = [getAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"), getAddress("0xf3b74384445fD0CE94b1aecBa1791eE0c1Ca49AA")];


function company_create(
  companyName,
  description,
  companyAdminAddress,
  companyLogo,
  pricePerShare,
  minShare,
  country,
  state,
  regNum,
) {
  try {
    if (!is_company_complete(
      companyName,
      description,
      companyAdminAddress,
      companyLogo,
      pricePerShare,
      minShare,
      country,
      state,
      regNum)) {
      throw new EvalError(
        `company profile not completed`
      );
    }

    let company = new CompanyShares(
      companyName,
      description,
      companyAdminAddress,
      companyLogo,
      pricePerShare,
      minShare,
      country,
      state,
      regNum
    );
    companies.set(company.id, company);
    let company_json = JSON.stringify(company);
    const notice_payload = `${company_json}`;
    console.log(
      `Company ${company.id} created for buying and selling of shares, awaiting admin's approval`
    );
    return new Notice(notice_payload);
  } catch (e) {
    const error_msg = `Failed to create company ${e}`;
    console.debug(error_msg);

    return new Error_out(error_msg);
  }
}

function update_company_status(
  company_id,
  new_status,
  msg_sender
) {
  try {
    if (!isDappAdminAction(
      msg_sender)) {
      throw new EvalError(
        `not DeFiVista admin`
      );
    }
    if (!company_exist(
      company_id)) {
      throw new EvalError(
        `company doesn't exist`
      );
    }

    // Access and update the object in the map
    let keyToUpdate = company_id;
    if (companies.has(keyToUpdate)) {
      let updatedObject = companies.get(keyToUpdate);
      updatedObject.status = new_status;

      // Update the object in the map
      companies.set(keyToUpdate, updatedObject);
      console.log('Updated Map:', companies);
    }

    let company = companies.get(company_id);
    const notice_payload = `{{"type":"update_company_status","content":${JSON.stringify(company)}}}`;
    console.log(
      `Company ${company.id} status updated`
    );
    return new Notice(notice_payload);
    //   if (!this.seller_owns_item(seller, item)) {
    //     throw new EvalError(
    //       `Seller ${seller} must own item ${item.erc721} id:${item.token_id} to auction it`
    //     );
    //   }
  } catch (e) {
    const error_msg = `Failed to create company ${e}`;
    console.debug(error_msg);

    return new Error_out(error_msg);
  }
}

function shares_purchase(
  msg_sender,
  company_id,
  amount_of_shares,
  amount,
) {
  try {
    if (!company_exist(
      company_id)) {
      throw new EvalError(
        `company doesn't exist`
      );
    }
    const company = companies.get(company_id);
    if (share_holder === company.companyAdminAddress) {
      throw new EvalError(`${msg_sender} cannot buy shares in their own company`);
    }
    // if (amount <= 0) {
    //   throw new EvalError(`Amount ${amount} must be greater than zero`);
    //   return;
    // }
    // if (!this.has_enough_funds(msg_sender, amount)) {
    //   throw new EvalError(`Account ${msg_sender} doesn't have enough funds`);
    // }

    // this.wallet._ether_deposit(
    //   getAddress(winning_bid.author),
    //   getAddress(auction.creator),
    //   getAddress(auction.erc20),
    //   BigInt(winning_bid.amount.toString())
    // );

    const details = { msg_sender, company_id, amount_of_shares, amount }


    company.acquisition(details);

    //update price of shares as more buyers buy
    let keyToUpdate = company_id;
    if (companies.has(keyToUpdate)) {
      let updatedObject = companies.get(keyToUpdate);
      updatedObject.pricePerShare = (updatedObject.pricePerShare + ((amount_of_shares / 100) * 10));

      // Update the object in the map
      companies.set(keyToUpdate, updatedObject);
      console.log('Company Shares price updated:', companies);
    }


    const shares_json = JSON.stringify({ share_holder, company_id, amount_of_shares, amount });
    console.log(`Shares Acquisition worth ${amount} gotten for ${company_id}`);
    return new Notice(`{{"type":"shares_purchase","content":${shares_json}}}`);
  } catch (e) {
    const error_msg = `failed to acquire shares ${e}`;
    console.debug(error_msg);
    return new Error_out(error_msg);
  }
}


function shares_withdraw(
  msg_sender,
  company_id,
) {
  try {
    if (!company_exist(
      company_id)) {
      throw new EvalError(
        `company doesn't exist`
      );
    }
    const company = companies.get(company_id);
    if (share_holder === company.companyAdminAddress) {
      throw new EvalError(`${msg_sender} cannot withdraw shares in your own company`);
    }
    if (amount_of_shares <= 0) {
      throw new EvalError(`Amount ${amount} must be greater than zero`);
      return;
    }
    // if (!this.has_enough_funds(msg_sender, amount)) {
    //   throw new EvalError(`Account ${msg_sender} doesn't have enough funds`);
    // }

    // this.wallet._ether_deposit(
    //   getAddress(winning_bid.author),
    //   getAddress(auction.creator),
    //   getAddress(auction.erc20),
    //   BigInt(winning_bid.amount.toString())
    // );

    const details = { msg_sender, company_id, amount_of_shares, amount }

    company.acquisition_withdraw(msg_sender, company_id);

    //update price of shares as more buyers buy
    let keyToUpdate = company_id;
    if (companies.has(keyToUpdate)) {
      let updatedObject = companies.get(keyToUpdate);
      updatedObject.pricePerShare = (updatedObject.pricePerShare - ((amount_of_shares / 100) * 10));

      // Update the object in the map
      companies.set(keyToUpdate, updatedObject);
      console.log('Company Shares price updated:', companies);
    }


    const shares_json = JSON.stringify({ share_holder, company_id, amount_of_shares, amount });
    console.log(`Shares Acquisition worth ${amount} withdraw for ${company_id}`);
    return new Notice(`{{"type":"shares_withdraw","content":${shares_json}}}`);
  } catch (e) {
    const error_msg = `failed to withdraw shares ${e}`;
    console.debug(error_msg);
    return new Error_out(error_msg);
  }
}

function company_get(company_id) {
  try {
    if (!company_exist(
      company_id)) {
      throw new EvalError(
        `company doesn't exist`
      );
    }
    let company_json = companies.get(company_id);
    return company_json;
  } catch (e) {
    return new Error_out(`Company id ${company_id} not found`);
  }
}

function company_shareholders(company_id) {
  try {
    let company = companies.get(company_id);
    if (!company_exist(
      company_id)) {
      throw new EvalError(
        `company doesn't exist`
      );
    }
    return company.shareHolders;
  } catch (e) {
    let error_msg = `failed to list shareHolders for company id ${company_id} ${e}`;
    console.debug(error_msg);
    return new Error_out(error_msg);
  }
}

function companies_get_admin() {
  if (!isDappAdminAction(
    msg_sender)) {
    throw new EvalError(
      `not DeFiVista admin`
    );
  }
  let companies_json = JSON.stringify(companies);
  return companies_json;
}

function get_companies() {
  // Filter objects in the map based on a condition
  const filteredObjects = Array.from(companies).filter(([key, value]) => {
    // Replace the condition with your own filtering logic
    return value.status === 1;
  });

  // Create a new Map from the filtered array
  const filteredMap = new Map(filteredObjects);
  let companies_json = JSON.stringify(filteredMap);
  return companies_json;
}

function get_user_shares(msg_sender) {
  const userSharesCompany = [];
  // Filter objects in the map based on a condition
  const filteredObjects = Array.from(companies).filter((value, key) => value.status === 1);

  for (let index = 0; index < filteredObjects.length; index++) {
    const element = filteredObjects[index];
    for (let index = 0; index < element.shareHolders.length; index++) {
      const companyShares = element[index].shareHolders;
      if (companyShares.msg_sender == msg_sender) {
        userSharesCompany.push(element);
      }
    }
  }
  // Create a new Map from the filtered array
  const filteredMap = new Map(userSharesCompany);
  let companies_json = JSON.stringify(filteredMap);
  return new Log(companies_json);
}

function isDappAdminAction(msg_sender) {
  defiVestAdmins.forEach((admin, key) => {
    if (admin != msg_sender) {
      return false;
    }
  });
  return true;
}

function company_exist(company_id) {
  let company_json = companies.get(company_id);
  if (company_json == null) {
    return false;
  }
  else {
    return true;
  }
}

function is_company_complete(
  companyName,
  description,
  companyAdminAddress,
  companyLogo,
  pricePerShare,
  minShare,
  country,
  state,
  regNum) {
  if (!companyName, !description, !companyAdminAddress, !companyLogo, !pricePerShare, !minShare, !country, !state, !regNum) {
    return false
  } else {
    return true;
  }
}

// function has_enough_funds(share_holder, amount) {
//   let balance = wallet.balance_get(getAddress(share_holder));
//   let erc20_balance = balance.erc20_get(getAddress(cartesi_address));
//   if (cartesi_address === undefined) {
//     return false;
//   }
//   return BigInt(amount) <= erc20_balance;
// }

export { company_create, update_company_status, shares_purchase, company_shareholders, shares_withdraw, company_get, get_companies, get_user_shares, companies_get_admin }