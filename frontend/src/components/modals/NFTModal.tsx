import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { DappAddress, ERC721Address, formatIPFS } from "../../constants";
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
  nft_url: string;
  onClose: boolean | void | string | any;
};

const NFTModal = ({ isVisible, nft_url, onClose }: Props) => {
  const [processing, setProcessing] = useState<boolean>(false)
  const [nftUrl, setNFTUrl] = useState<string>("")
  const rollups = useRollups(DappAddress);
  const [postData, setPostData] = useState<boolean>(false);
  const [{ connectedChain }] = useSetChain();


  if (!isVisible) return null;

  return (
    <div>
      <div className="fixed inset-0 z-10 items-center justify-center bg-[#292929] bg-opacity-75"></div>
      <div
        className="fixed inset-0 flex justify-center items-center z-50"
        id="wrapper"
      >
        <div className="md:w-[650px] backdrop-blur-none z-50 flex flex-col relative ">
          <div className=" p-6 rounded">
            <div className="bg-gradient-to-r from-[#5522CC] to-[#ED4690] z-50 mx-auto flex flex-col px-4 py-8">
              <h2 className="text-white text-xl font-bold text-center mb-4 font-nexa">
                Event NFT Preview
              </h2>

              <div className="flex justify-center items-center">
                <img
                  alt="event_logo"
                  src={`https://ipfs.io/ipfs/${formatIPFS(nft_url)}`}
                  className="object-cover"
                />
              </div>

              <div className="flex flex-row mt-1 justify-between gap-4 pt-6">
                <div className="flex w-full">
                  <button
                    className="text-lg disabled:cursor-not-allowed font-semibold justify-center p-2 text-black bg-white w-full flex  hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                    onClick={() => onClose()}
                  >
                    Close
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

export default NFTModal;
