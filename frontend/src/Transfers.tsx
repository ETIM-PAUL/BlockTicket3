// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React, { useState } from "react";
import { ethers } from "ethers";
import { useRollups } from "./useRollups";
import { useWallets } from "@web3-onboard/react";
import { Vouchers } from "./Vouchers";
import { toast } from "react-toastify";
import { DappAddress } from "./constants";
import { FcMoneyTransfer } from "react-icons/fc";
import { RiLuggageDepositFill } from "react-icons/ri";
import { FaTelegramPlane } from "react-icons/fa";

interface IInputPropos {
  dappAddress: string;
}


export const Transfers: React.FC<IInputPropos> = (propos) => {
  const rollups = useRollups(propos.dappAddress);
  const [connectedWallet] = useWallets();
  const [dappRelayedAddress, setDappRelayedAddress] = useState<boolean>(false)
  const [etherAmount, setEtherAmount] = useState<string>("0.1");
  const [processing, setProcessing] = useState<boolean>(false)
  const [depositing, setDepositing] = useState<boolean>(false)
  const [active, setActive] = useState<string>("deposit")

  const provider = new ethers.providers.Web3Provider(connectedWallet.provider);

  const sendAddress = async () => {
    if (rollups) {
      try {
        await rollups.relayContract.relayDAppAddress(propos.dappAddress);
        setDappRelayedAddress(true);
      } catch (e) {
        console.log(`${e}`);
      }
    }
  };

  const depositEtherToPortal = async (amount: number) => {
    if (amount <= 0) {
      toast.error("amount must be greater than zero");
      return;
    }
    try {
      if (rollups && provider) {
        setDepositing(true);
        const data = ethers.utils.toUtf8Bytes(`Deposited (${amount}) ether.`);
        const txOverrides = { value: ethers.utils.parseEther(`${amount}`) };
        console.log("Ether to deposit: ", txOverrides);

        // const tx = await ...
        const result = await rollups.etherPortalContract.depositEther(
          propos.dappAddress,
          data,
          txOverrides
        );
        const receipt = await result.wait(1);
        console.log(receipt)
        toast.success("Ethers deposited successfully")
        setDepositing(false);
      }
    } catch (e: any) {
      setDepositing(false);
      console.log(`${e}`);
      toast.error(e?.data?.message)
    }
  };

  const withdrawEther = async (amount: number) => {
    if (amount <= 0) {
      toast.error("amount must be greater than zero");
      return;
    }
    try {
      if (rollups && provider) {
        setProcessing(true);
        let ether_amount = ethers.utils.parseEther(String(amount)).toString();
        const input_obj = {
          action: "ether_withdraw",
          args: {
            amount: ether_amount,
          },
        };
        const data = JSON.stringify(input_obj);
        let payload = ethers.utils.toUtf8Bytes(data);

        const result = await rollups.inputContract.addInput(DappAddress, payload);
        const receipt = await result.wait(1);
        // Search for the InputAdded event
        receipt.events?.find((e: any) => e.event === "InputAdded");
        toast.success("Ethers withdraw voucher created successfully")
        setProcessing(false);
      }
    } catch (e: any) {
      setProcessing(false);
      toast.error(e?.data?.message)
      console.log(e);
    }
  };


  return (
    <div className="px-4">
      <div className="flex justify-center w-full gap-2 md:gap-8">
        <div onClick={() => setActive("deposit")} className="flex flex-col gap- w-[100px] md:w-[150px] items-center p-3 shadow-xl rounded-[24px] border py-2 px-1 text-base hover:cursor-pointer bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
          <RiLuggageDepositFill className="text-center text-white text-2xl" />
          <span className="text-lg text-white font-bold">Deposit</span>
        </div>
        <div onClick={() => setActive("withdraw")} className="flex flex-col gap- w-[100px] md:w-[150px] items-center p-3 shadow-xl rounded-[24px] border py-2 px-1 text-base hover:cursor-pointer bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
          <FcMoneyTransfer className="text-center text-2xl" />
          <span className="text-lg text-white font-bold">Withdraw</span>
        </div>
        <div onClick={() => setActive("vouchers")} className="flex flex-col gap- w-[100px] md:w-[150px] items-center p-3 shadow-xl rounded-[24px] border py-2 px-1 text-base hover:cursor-pointer bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
          <FaTelegramPlane className="text-center text-white text-2xl" />
          <span className="text-lg text-white font-bold">Vouchers</span>
        </div>
      </div>

      <div className="mx-4 mt-6">
        {active === "deposit" &&
          <div>
            <h3 className="text-gray-600 text-sm text-start">
              BlockTicket3 receives asset deposits via Portal smart contracts on
              the base layer.
            </h3>

            <div className="w-full mt-4 flex flex-col justify-center text-center">
              <label
                htmlFor=""
                className="font-normal text-[17px] leading-5 tracking-[0.5%] "
              >
                Amount to Deposit (ETH)
              </label>
              <div className="flex items-center border-[1px] border-[#696969] rounded-lg pl-[10px] w-[80%] mx-auto gap-4 h-[72px] mt-2">
                <p className="font-normal head2 text-[24px] leading-[32px mt-1.5">ETH</p>
                <input
                  defaultValue={0.01}
                  value={etherAmount}
                  onChange={(e) => setEtherAmount(e.target.value)}
                  type="number"
                  className="w-full text-[36px] placeholder:text-[24px] leading-[53.2px] text-[#696969] h-[100%] outline-none rounded-r-lg"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                className="w-[360px] h-[58px] rounded-lg bg-gradient-to-l from-[#5522CC] to-[#ED4690] text-[#FEFEFE] text-[17px] leading-[25.5px] tracking-[0.5%] mt-6"
                onClick={() => {
                  depositEtherToPortal(Number(etherAmount));
                }}
                disabled={!rollups || depositing || processing}
              >
                {depositing ? "Processing" : "Deposit"}
              </button>
            </div>
          </div>
        }
        {active === "withdraw" &&
          <div>
            <h3 className="text-gray-600 text-sm text-start md:text-center">
              BlockTicket3 receives asset deposits via Portal smart contracts on
              the base layer.
            </h3>

            <div className="w-full mt-4 flex flex-col justify-center text-center">
              <label
                htmlFor=""
                className="font-normal text-[17px] leading-5 tracking-[0.5%] "
              >
                Amount to Withdraw (ETH)
              </label>
              <div className="flex items-center border-[1px] border-[#696969] rounded-lg pl-[10px] w-[80%] mx-auto gap-4 h-[72px] mt-2">
                <p className="font-normal head2 text-[24px] leading-[32px mt-1.5">ETH</p>
                <input
                  defaultValue={0.01}
                  value={etherAmount}
                  onChange={(e) => setEtherAmount(e.target.value)}
                  type="number"
                  className="w-full text-[36px] placeholder:text-[24px] leading-[53.2px] text-[#696969] h-[100%] outline-none rounded-r-lg"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                className="w-[360px] h-[58px] disabled:cursor-not-allowed rounded-lg bg-gradient-to-l from-[#5522CC] to-[#ED4690] text-[#FEFEFE] text-[17px] leading-[25.5px] tracking-[0.5%] mt-6"
                onClick={() => {
                  withdrawEther(Number(etherAmount));
                }}
                disabled={!rollups || depositing || processing}
              >
                {processing ? "Processing" : "Withdraw"}
              </button>
            </div>
          </div>
        }
        {active === "vouchers" &&
          <div>
            <div>
              <h3 className="text-gray-600 text-sm text-start md:text-center">
                After the withdraw request, the user has to execute a voucher to transfer assets from blockTicket3 dApp to their account.
              </h3>
              <br />
              {!dappRelayedAddress &&
                <div className="w-full flex flex-col items-center">
                  Let the dApp know its address! <br />
                  <button
                    className="w-[360px] h-[58px] disabled:cursor-not-allowed rounded-lg bg-gradient-to-l from-[#5522CC] to-[#ED4690] text-[#FEFEFE] text-[17px] leading-[25.5px] tracking-[0.5%] mt-6"
                    onClick={() => sendAddress()}
                    disabled={!rollups || depositing || processing}
                  >
                    {depositing ? "Processing" : "Relay Address"}
                  </button>
                  <br />
                  <br />
                </div>
              }
              {dappRelayedAddress && <Vouchers dappAddress={propos.dappAddress} />}
            </div>
          </div>
        }
      </div>
    </div>
  );
};