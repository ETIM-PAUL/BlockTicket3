import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { DappAddress } from "../../constants";
import { useRollups } from "../../useRollups";
import { toast } from "react-toastify";
import { useSetChain } from "@web3-onboard/react";
import configFile from "../../config.json";

const config: any = configFile;
interface Report {
  payload: string;
}

type Props = {
  isVisible: boolean;
  id: Number;
  ticket_id: Number;
  onClose: boolean | void | string | any;
  walletNavigate: any;
};

const ClaimNFTModal = ({ isVisible, onClose, id, ticket_id, walletNavigate }: Props) => {
  const [processing, setProcessing] = useState<boolean>(false)
  const [nftUrl, setNFTUrl] = useState<string>("")
  const rollups = useRollups(DappAddress);
  const [postData, setPostData] = useState<boolean>(false);
  const [{ connectedChain }] = useSetChain();


  // Find the event with the matching id
  const fetchEventDetails = async (str: string) => {
    let payload = str;
    if (!connectedChain) {
      return;
    }

    let apiURL = ""

    if (config[connectedChain.id]?.inspectAPIURL) {
      apiURL = `${config[connectedChain.id].inspectAPIURL}/inspect`;
    } else {
      console.error(`No inspect interface defined for chain ${connectedChain.id}`);
      return;
    }

    let fetchData: Promise<Response>;
    if (postData) {
      const payloadBlob = new TextEncoder().encode(payload);
      fetchData = fetch(`${apiURL}`, { method: 'POST', body: payloadBlob });
    } else {
      fetchData = fetch(`${apiURL}/${payload}`);
    }
    fetchData
      .then(response => response.json())
      .then(data => {
        // Decode payload from each report
        const decode = data.reports.map((report: Report) => {
          return ethers.utils.toUtf8String(report.payload);
        });
        const reportData = JSON.parse(decode)
        console.log(reportData)
        setNFTUrl(reportData.event?.tokenUrl)
      });
  }

  useEffect(() => {
    fetchEventDetails(`get/${Number(id)}`)
    // If no eventData was found, show a message
  }, [])

  if (!isVisible) return null;

  const claimNFT = async (e: any) => {
    if (rollups) {
      try {
        setProcessing(true);
        let str = `{"action": "claim_nft", "id": ${id}, "ticket_id": ${ticket_id}, "nft_url":"${nftUrl}"`
        let data = ethers.utils.toUtf8Bytes(str);

        const result = await rollups.inputContract.addInput(DappAddress, data);
        const receipt = await result.wait(1);
        // Search for the InputAdded event
        receipt.events?.find((e: any) => e.event === "InputAdded");
        toast.success("Event NFT Voucher has been created successfully")
        setProcessing(false);
        walletNavigate();
        onClose();
      } catch (error) {
        console.log("error", error)
        setProcessing(false)
      }
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-10 items-center justify-center bg-[#292929] bg-opacity-75"></div>
      <div
        className="fixed inset-0 flex justify-center items-center z-50"
        id="wrapper"
      >
        <div className="md:w-[650px] backdrop-blur-none z-50 flex flex-col relative ">
          <div className=" p-6 rounded">
            <div className="bg-gradient-to-r from-[#5522CC] to-[#ED4690] z-50 mx-auto flex flex-col mt-10 px-4 py-16">
              <h2 className="text-white text-xl text-center font-nexa">
                You are about to claim the Event NFT (POAP)?
              </h2>

              <div className="flex flex-row mt-1 justify-between gap-4 pt-6">
                {/* Up Vote */}
                <div className="flex w-full">
                  <button
                    disabled={processing}
                    className="text-lg disabled:cursor-not-allowed font-semibold justify-center p-2 text-black bg-white w-full flex  hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                    onClick={() => onClose()}
                  >
                    No
                  </button>
                </div>

                {/* Down Vote*/}
                <div className="flex w-full">
                  <button onClick={claimNFT} disabled={processing} className="disabled:cursor-not-allowed w-full text-lg font-semibold text-center justify-center   bg-gradient-to-r from-[#5522CC] to-[#8352f5]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]">
                    {processing ? "Processing" : "Yes"}
                  </button>
                </div>
              </div>
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimNFTModal;
