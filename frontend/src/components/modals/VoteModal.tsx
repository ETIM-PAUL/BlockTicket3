import { ethers } from "ethers";
import React, { useState } from "react";
import { useRollups } from "../../useRollups";
import { DappAddress } from "../../constants";
import { toast } from "react-toastify";
import { useConnectWallet } from "@web3-onboard/react";

type Props = {
    event_id: number;
    event_organizer: string;
    isVisible: boolean;
    proposal: any;
    onClose: boolean | void | string | any;
};

const VoteModal = ({ isVisible, onClose, proposal, event_id, event_organizer }: Props) => {
    const [downVoteProcessing, setDownVoteProcessing] = useState<boolean>(false)
    const [upvoteProcessing, setUpvoteProcessing] = useState<boolean>(false)
    const [voters, setVoters] = useState<any>(typeof proposal?.voters === "string" ? JSON.parse(proposal?.voters) : proposal?.voters)
    const rollups = useRollups(DappAddress);
    const [{ wallet }] = useConnectWallet();

    if (!isVisible) return null;

    const handleClose = (e: any) => {
        if (e.target.id === "wrapper") onClose();
    };

    const voteProposal = async (type: string) => {
        if (wallet?.accounts[0]?.address === event_organizer) {
            toast.error("Unauthorized access as Event Organizer")
            return;
        }
        if (voters.length > 0 && voters.find((voter: any) => voter === wallet?.accounts[0]?.address)) {
            toast.error("Already Voted for this proposal");
            return;
        }
        try {
            if (rollups) {
                try {
                    if (type === "upvote") {
                        setUpvoteProcessing(true);
                    } else {
                        setDownVoteProcessing(true);
                    }

                    let str = `{"action": "action_proposal", "id":${event_id}, "proposal_id": ${proposal?.id}, "upvote":${type === "upvote" ? true : false}}`
                    let data = ethers.utils.toUtf8Bytes(str);

                    const result = await rollups.inputContract.addInput(DappAddress, data);
                    const receipt = await result.wait(1);
                    // Search for the InputAdded event
                    receipt.events?.find((e: any) => e.event === "InputAdded");
                    toast.success("Proposal Vote updated")
                    if (type === "upvote") {
                        setUpvoteProcessing(false);
                        proposal.upvotes = proposal.upvotes + 1;
                    } else {
                        proposal.downvotes = proposal.downvotes + 1;
                        setDownVoteProcessing(false);
                    }
                    setVoters([...voters, wallet?.accounts[0]?.address])
                    onClose();
                } catch (error) {
                    if (type === "upvote") {
                        setUpvoteProcessing(false);
                    } else {
                        setDownVoteProcessing(false);
                    }
                }
            }
        } catch (error) {
            if (type === "upvote") {
                setUpvoteProcessing(false);
            } else {
                setDownVoteProcessing(false);
            }
        }
    }

    return (
        <div>
            <div className="fixed inset-0 z-10 items-center justify-center bg-[#292929] bg-opacity-25"></div>
            <div
                className="fixed inset-0 flex justify-center items-center z-50"
                id="wrapper"
                onClick={handleClose}
            >
                <div className="w-[550px]    bg-gradient-to-l from-[#5522CC] to-[#ED4690] backdrop-blur-none z-50 flex flex-col relative ">
                    <div className=" p-10 rounded">
                        <button
                            className="text-white text-2xl absolute top-4 right-8   "
                            onClick={() => onClose()}
                        >
                            X
                        </button>

                        <div className="  bg-gradient-to-r from-[#5522CC] to-[#ED4690]   z-50  mx-auto flex flex-col mt-2  p-4  ">
                            <h2 className="text-white font-bold text-xl text-center font-nexa pt-4">
                                Give Your Vote
                            </h2>
                            <p className="text-center mt-4">
                                You Vote counts we want to hear from you concerning the proposal.
                            </p>

                            <div className="flex mt-5 justify-between gap-2 md:gap-8 md:mx-6">
                                {/* Down Vote*/}
                                <button
                                    disabled={downVoteProcessing || upvoteProcessing}
                                    onClick={() => voteProposal("downvote")}
                                    className="text-lg disabled:cursor-not-allowed font-semibold justify-center p-2 text-black bg-white w-full flex hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                >
                                    {(!downVoteProcessing) ?
                                        "Down Vote"
                                        :
                                        "Processing"
                                    }
                                </button>

                                {/* Up Vote */}
                                <button
                                    disabled={upvoteProcessing || downVoteProcessing}
                                    onClick={() => voteProposal("upvote")}
                                    className="text-lg disabled:cursor-not-allowed disabled:opacity-50 font-semibold text-center justify-center p-2  w-full  flex bg-gradient-to-r from-[#5522CC] to-[#8352f5]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]">
                                    {(!upvoteProcessing) ?
                                        "Up Vote"
                                        :
                                        "Processing"
                                    }
                                </button>
                            </div>
                        </div>
                        {/*  */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoteModal;
