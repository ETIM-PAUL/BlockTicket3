import React, { useState } from "react";

type Props = {
    isVisible: boolean;
    setReferralCode: any;
    onClose: boolean | void | string | any;
    onSubmit: any;
};

const TicketPurchaseModal = ({ isVisible, onClose, onSubmit, setReferralCode }: Props) => {
    const [referalCode, setReferalCode] = useState();

    if (!isVisible) return null;

    const handleClose = (e: any) => {
        if (e.target.id === "wrapper") onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-10 items-center justify-center"></div>
            <div
                className="fixed inset-0 flex justify-center items-center z-50"
                id="wrapper"
                onClick={handleClose}
            >
                <div className="w-[650px] flex flex-col relative">
                    <div className="p-6  rounded">
                        <div className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]   mx-10 flex flex-col mt-2  px-8 py-12  ">
                            <div className="space-y-8">
                                <h2 className="text-white font-bold text-2xl text-center font-nexa ">
                                    Buy Your Ticket
                                </h2>
                                <div className="flex flex-row gap-2 justify-center text-lg items-center">
                                    <label htmlFor="referalCode" className="text-white">
                                        Referal Code:
                                    </label>
                                    <input
                                        value={referalCode}
                                        onChange={(e: any) => { setReferalCode(e.target.value); setReferralCode(e.target.value) }}
                                        className="bg-white outline-none px-4 py-2 text-black w-1/2 text-base"
                                        type="text"
                                        placeholder="Your Referral Code (Optional)"
                                    />
                                </div>

                                <div className="flex  justify-between gap-2">
                                    <button
                                        className="text-lg font-semibold justify-center p-3 
                text-black bg-white w-full flex hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]
                "
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={(e: any) => { onSubmit(); handleClose(e) }}
                                        type="submit"
                                        className="text-lg font-semibold text-center justify-center p-3
                    
                    w-full  flex  bg-gradient-to-r from-[#5522CC] to-[#8352f5]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                    >
                                        Submit
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

export default TicketPurchaseModal;
