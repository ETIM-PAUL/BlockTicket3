import { Voucher, Notice, Error_out, Log, Output, Report } from "./outputs.js";
import { Balance } from "./balance.js";
import {
  getAddress,
  parseEther,
} from "viem";
// import { CartesiDappABI, erc20ABI, erc721ABI } from "./rollups.js";
import { ethers } from "ethers";

class Wallet {
  static accounts;
  constructor(accounts) {
    Wallet.accounts = accounts;
  }

  _balance_get = (_account) => {
    let balance = Wallet.accounts.get(_account);
    if (balance === undefined || !balance) {
      Wallet.accounts.set(
        _account,
        new Balance(_account, BigInt(0), new Map(), new Map())
      );
      balance = Wallet.accounts.get(_account);
    }
    return balance;
  };

  balance_get = (_account) => {
    //Retrieve balance of all ERC20 and ERC721 tokens for account
    console.info(`Balance for ${_account} retrieved`);
    return this._balance_get(_account);
  };

  ether_deposit_process = (account, amount) => {
    try {
      return this._ether_deposit(account, amount);
    } catch (e) {
      return new Error_out(String(e));
    }
  };

  _ether_deposit_parse = (_payload) => {
    try {
      let input_data = [];

      input_data[0] = ethers.dataSlice(_payload, 0, 20);
      input_data[1] = ethers.dataSlice(_payload, 20, 52);

      if (!input_data[0]) {
        throw new EvalError("ether deposit unsuccessful");
        return ["0x0", BigInt(0)];
      }
      console.debug("input data is", input_data);
      return [
        getAddress(input_data[0]),
        parseEther(String(parseInt(input_data[1])), "gwei"),
      ];
    } catch (e) {
      throw new EvalError(String(e));
      return ["0x0", BigInt(0)];
    }
  };

  _ether_deposit = (account, amount) => {
    let balance = this._balance_get(account);
    console.log("balance is", balance);
    balance.ether_increase(amount);
    let notice_payload = {
      type: "etherdeposit",
      content: {
        address: account,
        amount: amount.toString(),
      },
    };
    return new Notice(JSON.stringify(notice_payload));
  };

  // ether_withdraw = (
  //   rollup_address,
  //   account,
  //   amount
  // ) => {
  //   try {
  //     let balance = this._balance_get(account);
  //     balance.ether_decrease(amount);
  //     const call = encodeFunctionData({
  //       abi: CartesiDappABI,
  //       functionName: "withdrawEther",
  //       args: [getAddress(account), amount],
  //     });
  //     return new Voucher(rollup_address, hexToBytes(call));
  //   } catch (e) {
  //     console.log(e);
  //     return new Error_out(`error withdrawing ether ${e}`);
  //   }
  // };

  // ether_transfer = (account: Address, to: Address, amount: bigint) => {
  //   try {
  //     let balance = this._balance_get(account);
  //     let balance_to = this._balance_get(to);
  //     balance.ether_decrease(amount);
  //     balance_to.ether_increase(amount);
  //     let notice_payload = {
  //       type: "erc20transfer",
  //       content: {
  //         from: account,
  //         to: to,
  //         amount: amount.toString(),
  //       },
  //     };
  //     console.info(`${amount} ether transferred from ${account} to ${to}`);
  //     return new Notice(JSON.stringify(notice_payload));
  //   } catch (e) {
  //     console.log(e);

  //     return new Error_out(String(e));
  //   }
  // };

}

export { Wallet };