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
                    <thead className="text-white font-semibold text-base bg-black ">
                        <tr>
                            <th>Id</th>
                            <th>Proposal</th>
                            <th>UpVotes</th>
                            <th>DownVotes</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {ProposalData.map((proposalData: any) => (
                            <tr
                                key={proposalData.id}
                                className={
                                    proposalData.id % 2 === 0
                                        ? "bg-[#292929]"
                                        : "bg-[#343434]"
                                }
                            >
                                <td>{proposalData.id}</td>
                                <td>{proposalData.proposal}</td>
                                <td>{proposalData.upvote}</td>
                                <td>{proposalData.downvote}</td>
                                <td>
                                    <button
                                        className="bg-white px-4 text-black  py-1 text-lg hover:bg-black hover:text-white "
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
