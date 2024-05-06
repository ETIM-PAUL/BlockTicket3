import React from "react";
import TicketPurchaseForm from "../TicketPurchaseForm";

type Props = {
    isVisible: boolean;
    onClose: boolean | void | string | any;
};

const TicketPurchaseModal = ({ isVisible, onClose }: Props) => {
    if (!isVisible) return null;

    const handleClose = (e: any) => {
        if (e.target.id === "wrapper") onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-10 items-center justify-center bg-[#292929] bg-opacity-25"></div>

            <div
                className="fixed inset-0 flex justify-center items-center z-50"
                id="wrapper"
                onClick={handleClose}
            >
                <div className="w-[800px]  flex flex-col relative">
                    <div className=" px-2  rounded">

                        <div className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]   mx-10 flex flex-col mt-2  px-8 py-16  ">
                            <TicketPurchaseForm onClose={onClose} />
                        </div>
                        {/*  */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TicketPurchaseModal;
