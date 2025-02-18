import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import { DappAddress } from "../../constants";
import { useRollups } from "../../useRollups";
import { toast } from "react-toastify";
import { GlobalContext } from "../../context/GlobalContext";

type Props = {
  isVisible: boolean;
  id: Number;
  onClose: boolean | void | string | any;
  eventDetails: any
  setEventDetails: any
};

const CancelEventModal = ({ isVisible, onClose, id, setEventDetails, eventDetails }: Props) => {
  const [processing, setProcessing] = useState<boolean>(false)
  const rollups = useRollups(DappAddress);
  const { dispatch }: any = useContext(GlobalContext);

  if (!isVisible) return null;

  const cancelEvent = async (e: any) => {
    if (rollups) {

      try {
        setProcessing(true);
        let str = `{"action": "cancel_event", "id": "${id}"}`
        let data = ethers.utils.toUtf8Bytes(str);

        const result = await rollups.inputContract.addInput(DappAddress, data);
        const receipt = await result.wait(1);
        // Search for the InputAdded event
        const event = receipt.events?.find((e: any) => e.event === "InputAdded");
        if (event) {
          dispatch({
            type: "UPDATE_EVENT_STATUS",
            payload: { id, status: 3 },
          });
          setEventDetails({ ...eventDetails, status: 3 })
          toast.success("Event has been cancelled successfully")
          setProcessing(false);
          onClose();
        }
      } catch (error) {
        console.log("error", error)
        setProcessing(false)
      }
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-10 items-center justify-center bg-[#292929] bg-opacity-75"></div>
      <div
        className="fixed inset-0 flex justify-center items-center z-50"
        id="wrapper"
      >
        <div className="md:w-[650px] backdrop-blur-none z-50 flex flex-col relative ">
          <div className=" p-6 rounded">
            <div className="bg-gradient-to-r from-[#5522CC] to-[#ED4690] z-50 mx-auto flex flex-col mt-10 px-4 py-16">
              <h2 className="text-white text-xl text-center font-nexa">
                Are you sure you want to cancel this event?
              </h2>

              <div className="flex flex-row mt-1 justify-between gap-4 pt-6">
                {/* Up Vote */}
                <div className="flex w-full">
                  <button
                    disabled={processing}
                    className="text-lg disabled:cursor-not-allowed font-semibold justify-center p-2 text-black bg-white w-full flex  hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                    onClick={() => onClose()}
                  >
                    No
                  </button>
                </div>

                {/* Down Vote*/}
                <div className="flex w-full">
                  <button onClick={cancelEvent} disabled={processing} className="disabled:cursor-not-allowed w-full text-lg font-semibold text-center justify-center   bg-gradient-to-r from-[#5522CC] to-[#8352f5]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]">
                    {processing ? "Processing" : "Yes"}
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

export default CancelEventModal;
