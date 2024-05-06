import React, { useState } from "react";

const TicketPurchaseForm = ({ onClose }) => {
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
                    className="bg-white outline-none px-4 py-2 text-black w-1/2"
                    type="text"
                    placeholder="Your Referal Code (Optional)"
                />
            </div>

            <div className="flex  justify-between gap-8">
                <button
                    className="text-lg font-semibold justify-center p-3 
                text-black bg-white w-full flex hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]
                "
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="text-lg font-semibold text-center justify-center p-3
                    
                    w-full  flex  bg-gradient-to-r from-[#5522CC] to-[#8352f5]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default TicketPurchaseForm;
