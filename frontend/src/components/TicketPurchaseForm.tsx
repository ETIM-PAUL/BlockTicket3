import React, { useState } from "react";

type Props = {};

const TicketPurchaseForm = (props: Props) => {
    const [referalCode, setReferalCode] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            <h2 className="text-white font-bold text-2xl text-center font-nexa ">
                Buy Your Ticket
            </h2>
            <div className="flex flex-row gap-4 justify-center text-lg items-center">
                <label htmlFor="referalCode" className="text-white">
                    Referal Code:
                </label>
                <input
                    value={referalCode}
                    onChange={(e: any) => setReferalCode(e.target.value)}
                    className="bg-white outline-none px-4 py-2 text-black"
                    type="text"
                    placeholder="Your Referal Code"
                />
            </div>

            <div className="flex  justify-between gap-8">
                <button className="text-lg font-semibold justify-center p-4 text-black bg-white w-full flex hover:bg-[#292929] hover:text-white">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="text-lg font-semibold text-center justify-center p-4 bg-[#292929] text-white w-full  flex hover:bg-white hover:text-black "
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default TicketPurchaseForm;
