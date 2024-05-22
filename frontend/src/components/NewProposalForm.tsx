import React, { useState } from "react";

type Props = {};

const NewProposalForm = (props: Props) => {
    const [proposal, setProposal] = useState();

    const handleSubmit = (e: any) => {
        e.preventDefault();
    };

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
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
                    placeholder="Create your proposal about the events you registered for"
                    className="text-center p-2 bg-[#EEE1FF] text-black"
                ></textarea>
            </div>

            <div className="flex  justify-between gap-8 mx-4">
                <button className="text-lg font-semibold justify-center p-4 text-black bg-white w-full flex hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="text-lg font-semibold text-center justify-center p-4  w-full  flex bg-gradient-to-r from-[#5522CC] to-[#8352f5]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] "
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default NewProposalForm;
