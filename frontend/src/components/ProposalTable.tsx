import React, { useState } from "react";
import { ProposalData } from "../constants";
import VoteModal from "./modals/VoteModal";

type Props = {};

const ProposalTable = (props: Props) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    return (
        <div className="mt-4">
            <div className="flex overflow-x-auto">
                <table className=" flex table  text-white -space-y-4 ">
                    <thead className="text-black font-semibold text-base bg-white">
                        <tr>
                            <th>Id</th>
                            <th>Proposal</th>
                            <th>UpVotes</th>
                            <th>DownVotes</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-lg">
                        {ProposalData.map((proposalData: any) => (
                            <tr
                                key={proposalData.id}
                                className={
                                    proposalData.id % 2 === 0
                                        ? "bg-[#9b76f2]"
                                        : "bg-[#8155ea]"
                                }
                            >
                                <td>{proposalData.id}</td>
                                <td>{proposalData.proposal}</td>
                                <td>{proposalData.upvote}</td>
                                <td>{proposalData.downvote}</td>
                                <td>
                                    <button
                                        className=" bg-white text-black hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] px-4   py-1 text-xl hover:bg-black"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Action
                                    </button>
                                </td>

                                <div className="">
                                    <VoteModal
                                        isVisible={showModal}
                                        onClose={() => setShowModal(false)}
                                    />
                                </div>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProposalTable;
