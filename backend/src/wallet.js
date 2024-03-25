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

  ether_deposit_process = (_payload) => {
    try {
      let [account, amount] = this._ether_deposit_parse(_payload);
      console.info(`${amount} ether deposited to account ${account}`);
      return this._ether_deposit(account, amount);
    } catch (e) {
      return new Error_out(String(e));
    }
  };

  // erc20_deposit_process = (_payload: string): Output => {
  //   //process the abi-encoded input data sent by the erc20 portal after and erc20 deposit
  //   try {
  //     let [erc20, account, amount] = this._erc20_deposit_parse(_payload);
  //     console.info(`${amount} ${erc20} tokens deposited to account ${account}`);
  //     return this._erc20_deposit(account, erc20, amount);
  //   } catch (e) {
  //     return new Error_out(`error depositing erc20 tokens ${e}`);
  //   }
  // };

  // erc721_deposit_process = (_payload: string): Output => {
  //   try {
  //     let [erc721, account, token_id] = this._erc721_deposit_parse(_payload);
  //     console.info(
  //       `Token ERC-721 ${erc721} id: ${token_id} deposited in ${account}`
  //     );
  //     return this._erc721_deposit(account, erc721, token_id);
  //   } catch (e) {
  //     return new Error_out(String(e));
  //   }
  // };

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
  // private _erc20_deposit_parse = (
  //   _payload: string
  // ): [Address, Address, bigint] => {
  //   try {
  //     let input_data = [];
  //     input_data[0] = ethers.dataSlice(_payload, 0, 1);
  //     input_data[1] = ethers.dataSlice(_payload, 1, 21);
  //     input_data[2] = ethers.dataSlice(_payload, 21, 41);
  //     input_data[3] = ethers.dataSlice(_payload, 41, 73);

  //     if (!input_data[0]) {
  //       throw new EvalError("erc20 deposit unsuccessful");
  //       return ["0x0", "0x0", BigInt(0)];
  //     }
  //     return [
  //       getAddress(input_data[1]),
  //       getAddress(input_data[2]),
  //       BigInt(input_data[3]),
  //       // parseEther(String(parseInt(input_data[3])), "gwei"),
  //     ];
  //   } catch (e) {
  //     throw new EvalError(String(e));
  //     return ["0x0", "0x0", BigInt(0)];
  //   }
  // };

  // private _erc721_deposit_parse = (
  //   _payload: string
  // ): [Address, Address, number] => {
  //   try {
  //     let input_data = [];
  //     input_data[0] = ethers.dataSlice(_payload, 0, 20);
  //     input_data[1] = ethers.dataSlice(_payload, 20, 40);
  //     input_data[2] = ethers.dataSlice(_payload, 40, 72);
  //     if (!input_data[0]) {
  //       throw new EvalError("erc721 deposit unsuccessful");
  //       return ["0x0", "0x0", 0];
  //     }
  //     console.log("input data is ", input_data);
  //     return [
  //       getAddress(input_data[0]),
  //       getAddress(input_data[1]),
  //       parseInt(input_data[2]),
  //     ];
  //   } catch (e) {
  //     throw new EvalError(String(e));
  //     return ["0x0", "0x0", 0];
  //   }
  // };

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

  // private _erc20_deposit = (
  //   account: Address,
  //   erc20: Address,
  //   amount: bigint
  // ) => {
  //   let balance = this._balance_get(account);

  //   balance.erc20_increase(erc20, amount);
  //   let notice_payload = {
  //     type: "erc20deposit",
  //     content: {
  //       address: account,
  //       erc20: erc20,
  //       amount: amount.toString(),
  //     },
  //   };
  //   return new Notice(JSON.stringify(notice_payload));
  // };

  // private _erc721_deposit = (
  //   account: Address,
  //   erc721: Address,
  //   token_id: number
  // ) => {
  //   try {
  //     let balance = this._balance_get(account);
  //     balance.erc721_add(erc721, token_id);
  //     let notice_payload = {
  //       type: "erc721deposit",
  //       content: {
  //         address: account,
  //         erc721: erc721,
  //         token_id: token_id.toString(),
  //       },
  //     };
  //     return new Notice(JSON.stringify(notice_payload));
  //   } catch (e) {
  //     return new Error_out(`unable to deposit erc721 ${e}`);
  //   }
  // };

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
  // erc20_withdraw = (account: Address, erc20: Address, amount: bigint) => {
  //   try {
  //     let balance = this._balance_get(account);
  //     balance.erc20_decrease(erc20, amount);
  //     const call = encodeFunctionData({
  //       abi: erc20ABI,
  //       functionName: "transfer",
  //       args: [getAddress(account), amount],
  //     });
  //     console.info(`${amount} ${erc20} tokens withdrawn form ${account}`);
  //     return new Voucher(erc20, hexToBytes(call));
  //   } catch (e) {
  //     console.log(e);
  //     return new Error_out(`error withdrawing ether ${e}`);
  //   }
  // };

  // erc20_transfer = (
  //   account: Address,
  //   to: Address,
  //   erc20: Address,
  //   amount: bigint
  // ) => {
  //   try {
  //     let balance = this._balance_get(account);
  //     let balance_to = this.balance_get(to);
  //     balance.erc20_decrease(erc20, amount);
  //     balance_to.erc20_increase(erc20, amount);
  //     let notice_payload = {
  //       type: "erc20transfer",
  //       content: {
  //         from: account,
  //         to: to,
  //         erc20: erc20,
  //         amount: amount.toString(),
  //       },
  //     };
  //     console.info(
  //       `${amount}${erc20} tokens transferred from ${account} to ${to}`
  //     );
  //     return new Notice(JSON.stringify(notice_payload));
  //   } catch (e) {
  //     return new Error_out(String(e));
  //   }
  // };

  // erc721_withdraw = (
  //   rollup_address: Address,
  //   sender: Address,
  //   erc721: Address,
  //   token_id: number
  // ) => {
  //   try {
  //     let balance = this._balance_get(sender);
  //     balance.erc721_remove(erc721, token_id);
  //   } catch (e) {
  //     return new Error_out(String(e));
  //   }
  //   let payload = encodeFunctionData({
  //     abi: erc721ABI,
  //     functionName: "safeTransferFrom",
  //     args: [getAddress(rollup_address), sender, token_id],
  //   });
  //   console.info(
  //     `Token ERC-721:${erc721} ,id:${token_id} withdrawn from ${sender}`
  //   );
  //   return new Voucher(erc721, hexToBytes(payload));
  // };

  // erc721_transfer = (
  //   account: Address,
  //   to: Address,
  //   erc721: Address,
  //   token_id: number
  // ) => {
  //   try {
  //     let balance = this._balance_get(account);
  //     let balance_to = this._balance_get(to);
  //     balance.erc721_remove(erc721, token_id);
  //     balance_to.erc721_add(erc721, token_id);
  //     let notice_payload = {
  //       type: "erc721transfer",
  //       content: {
  //         from: account,
  //         to: to,
  //         erc721: erc721,
  //         token_id: token_id.toString(),
  //       },
  //     };
  //     console.info(
  //       `Token ERC-721 ${erc721} id:${token_id} transferred from ${account} to ${to}`
  //     );
  //     return new Notice(JSON.stringify(notice_payload));
  //   } catch (e) {
  //     return new Error_out(String(e));
  //   }
  // };
}

export { Wallet };