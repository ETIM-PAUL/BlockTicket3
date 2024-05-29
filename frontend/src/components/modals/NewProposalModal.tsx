import React, { useState } from "react";

import { toast } from "react-toastify";
import { useRollups } from "../../useRollups";
import { DappAddress } from "../../constants";
import { ethers } from "ethers";
import { useConnectWallet } from "@web3-onboard/react";

type Props = {
    id: number;
    eventProposals: any;
    setEventProposals: any;
    isVisible: boolean;
    onClose: boolean | void | string | any;
};

const NewProposalModal = ({ isVisible, onClose, setEventProposals, eventProposals, id }: Props) => {
    const [proposal, setProposal] = useState("");
    const [processing, setProcessing] = useState<boolean>(false)
    const [{ wallet }] = useConnectWallet();
    const rollups = useRollups(DappAddress);

    if (!isVisible) return null;

    const createProposal = async () => {
        if (proposal.length > 100) {
            toast.error("Proposal can't exceed 100 characters");
            return;
        }
        if (proposal.length <= 5) {
            toast.error("Proposal too short. At least 5 characters");
            return;
        }
        try {
            if (rollups) {
                try {
                    setProcessing(true);
                    let str = `{"action": "create_proposal", "id": ${id}, "proposal":"${proposal}"}`
                    let data = ethers.utils.toUtf8Bytes(str);

                    const result = await rollups.inputContract.addInput(DappAddress, data);
                    const receipt = await result.wait(1);
                    // Search for the InputAdded event
                    receipt.events?.find((e: any) => e.event === "InputAdded");
                    setProposal("");
                    toast.success("Proposal created successfully")
                    setProcessing(false);
                    setEventProposals([...eventProposals, { "id": eventProposals[eventProposals.length - 1] ? eventProposals[eventProposals.length - 1].id + 1 : 1, "proposer": proposal, proposal: wallet?.accounts[0]?.address, voters: '[]', "upvotes": 0, "downvotes": 0 }])
                    onClose();
                } catch (error) {
                    console.log("error", error)
                    setProcessing(false)
                }
            }
        } catch (error) {
            setProcessing(true)
        }
    };
    const handleClose = (e: any) => {
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-10 items-center justify-center bg-[#292929] bg-opacity-75"></div>

            <div
                className="fixed inset-0 flex justify-center px-8 items-center z-50"
                id="wrapper"
            >
                <div className="w-full md:max-w-[800px]  bg-gradient-to-l from-[#5522CC] to-[#ED4690] flex flex-col relative ">
                    <div className=" md:p-14 rounded">

                        <div className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  mx-auto flex flex-col mt-2  p-4  ">
                            <div className="space-y-8">
                                <h2 className="text-white font-bold text-2xl text-center font-nexa ">
                                    Create New Proposal
                                </h2>
                                <div className="flex flex-row gap-4 justify-center text-lg items-center  ">
                                    <textarea
                                        value={proposal}
                                        onChange={(e: any) => setProposal(e.target.value)}
                                        name=""
                                        id=""
                                        cols={60}
                                        rows={3}
                                        maxLength={100}
                                        placeholder="Create your proposal for the event you registered for"
                                        className="text-start p-2 bg-[#EEE1FF] text-black"
                                    ></textarea>
                                </div>

                                <div className="flex  justify-between gap-2 md:gap-8 md:mx-6">
                                    <button
                                        disabled={processing}
                                        onClick={handleClose} className="text-lg disabled:cursor-not-allowed font-semibold justify-center p-2 text-black bg-white w-full flex hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => createProposal()}
                                        disabled={processing}
                                        type="submit"
                                        className="text-lg disabled:cursor-not-allowed disabled:opacity-50 font-semibold text-center justify-center p-2  w-full  flex bg-gradient-to-r from-[#5522CC] to-[#8352f5]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] "
                                    >
                                        {(!processing) ?
                                            "Submit"
                                            :
                                            "Processing"
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/*  */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewProposalModal;
