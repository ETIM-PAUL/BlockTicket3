import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import WalletConnect from "./WalletConnect";
import { Link } from "react-router-dom";
import axios from "axios";
import { bgImage } from "../assets";

type Props = {};

const CreateEvent = (props: Props) => {
    const [title, setTitle] = useState();
    const [date, setDate] = useState();
    const [location, setLocation] = useState();
    const [capacity, setCapacity] = useState();
    const [minReferal, setMinReferal] = useState();
    const [referalDiscount, setReferalDiscount] = useState();

    const [fileUrl, updateFileUrl] = useState("");
    const [newFile, updateNewFile] = useState("");
    const [ipfsLoading, setIpfsLoading] = useState(false);
    const [ipfsUpload, setIpfsUpload] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    async function uploadIPFS() {
        const file = newFile;
        try {
            if (file !== undefined) {
                setIpfsLoading(true);
                const formData = new FormData();
                formData.append("file", file);
                const pinataBody = {
                    options: {
                        cidVersion: 1,
                    },
                    // metadata: {
                    //     name: file.name,
                    // },
                };
                formData.append(
                    "pinataOptions",
                    JSON.stringify(pinataBody.options)
                );

                // formData.append(
                //     "pinataMetadata",
                //     JSON.stringify(pinataBody.metadata)
                // );
                const url = `${pinataConfig.root}/pinning/pinFileToIPFS`;
                const response = await axios({
                    method: "post",
                    url: url,
                    data: formData,
                    headers: pinataConfig.headers,
                });
                updateFileUrl(`ipfs://${response.data.IpfsHash}/`);
                setIpfsUpload(`ipfs://${response.data.IpfsHash}/`);
                queryPinataFiles();
            } else {
                // toast.error("Please upload a document detailing the project outlines, aims and objectives");
                setIpfsLoading(false);
                return;
            }
            setIpfsLoading(false);
        } catch (error) {
            setIpfsLoading(false);
            console.log(error);
        }
    }

    const queryPinataFiles = async () => {
        try {
            const url = `${pinataConfig.root}/data/pinList?status=pinned`;
            const response = await axios.get(url, pinataConfig);
        } catch (error) {
            console.log(error);
        }
    };

    const pinataConfig = {
        root: "https://api.pinata.cloud",
        headers: {
            pinata_api_key: "e98332f4fcdf7aa677fa",
            pinata_secret_api_key:
                "ddba77116b8064d68c18b734f8b2fe484b18349b8a1c7af90006689e944ff59a",
        },
    };

    const testPinataConnection = async () => {
        try {
            const url = `${pinataConfig.root}/data/testAuthentication`;
            const res = await axios.get(url, { headers: pinataConfig.headers });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        testPinataConnection();
    });

    return (
        <>
            <div
                className="navbar bg-base-100 p-8 bg-gradient-to-r from-[#5522CC] to-[#ED4690]
             "
            >
                <div className="flex-1 ml-16 ">
                    <Logo />
                </div>
                <div className="flex mr-20 gap-10  ">
                    <Link
                        to="/events"
                        className="font-medium rounded-lg text-lg px-4 py-3 text-center bg-white text-black"
                    >
                        All Events
                    </Link>

                    <WalletConnect />
                </div>
            </div>

            <div className="w-full bg-[#EEE1FF] h-10"></div>

            <div className="flex bg-white   flex-row">
                <div
                    className=" flex w-1/2 relative h-[1000px]  bg-center bg-cover"
                    style={{ backgroundImage: `url(${bgImage})` }}
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#5522CC] to-[#ED4690] opacity-85"></div>

                    <div className="flex flex-row z-10 justify-center items-center  mt-24">
                        <div className="flex flex-col w-full">
                            <p className="font-medium text-2xl text-white sm:leading-[50px] leading-[20px] w-full text-center">
                                Ticketing and Event Management Made Easy{" "}
                            </p>
                            <p className=" text-lg mt-6 text-white text-center mx-16">
                                Create your event tickets, Manage your ticketing
                                and allow user to Upvote their favourite event/s
                                or Downvote event/s and give users referral
                                bonus for inviting the friends and fans to your
                                event.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1   bg-gradient-to-r from-[#5522CC] to-[#ED4690] px-24">
                    <form
                        action=""
                        className=" w-full shadow-2xl  px-6 rounded-lg  my-6 "
                    >
                        <div className="flex flex-col space-y-3 py-6 text-white">
                            <h2 className="text-2xl font-semibold  justify-center flex">
                                Create Event
                            </h2>

                            <div className="flex flex-col gap space-y-1 w-full ">
                                <label htmlFor="title">Title</label>
                                <input
                                    value={title}
                                    onChange={(e: any) =>
                                        setTitle(e.target.value)
                                    }
                                    type="text"
                                    placeholder="Event title"
                                    required
                                    className="  h-[50px] bg-transparent border border-[#999999]  outline-none p-3 items-center "
                                />
                            </div>
                            {/*  */}
                            <div className="flex flex-col gap space-y-1 ">
                                <label htmlFor="date">Date</label>
                                <input
                                    value={date}
                                    onChange={(e: any) =>
                                        setDate(e.target.value)
                                    }
                                    type="date"
                                    placeholder="Event Date"
                                    required
                                    className="  h-[50px] bg-transparent border border-[#999999]  outline-none p-3 "
                                />
                            </div>
                            {/*  */}
                            <div className="flex flex-col gap space-y-1 ">
                                <label htmlFor="location">Location</label>
                                <input
                                    value={location}
                                    onChange={(e: any) =>
                                        setLocation(e.target.value)
                                    }
                                    type="text"
                                    placeholder="Event Location"
                                    required
                                    className="  h-[50px] bg-transparent border border-[#999999]  outline-none p-3 "
                                />
                            </div>
                            {/*  */}
                            <div className="flex flex-col gap space-y-1 ">
                                <label htmlFor="capacity">
                                    Maximum Capacity
                                </label>
                                <input
                                    value={capacity}
                                    onChange={(e: any) =>
                                        setCapacity(e.target.value)
                                    }
                                    type="number"
                                    placeholder="Event Capacity"
                                    required
                                    className="  h-[50px] bg-transparent border border-[#999999]  outline-none p-3 "
                                />
                            </div>

                            {/*  */}
                            <div className="flex flex-col gap space-y-1 ">
                                <label htmlFor="minReferal">
                                    Minimum Referral
                                </label>
                                <input
                                    value={minReferal}
                                    disabled
                                    onChange={(e: any) =>
                                        setMinReferal(e.target.value)
                                    }
                                    type="number"
                                    placeholder="Minimum referrals required to get a discount"
                                    required
                                    className=" disabled h-[50px] bg-transparent border border-[#999999]  outline-none p-3 cursor-not-allowed "
                                />
                            </div>
                            {/*  */}
                            <div className="flex flex-col gap space-y-1 ">
                                <label htmlFor="refDiscount">
                                    Referral Discount
                                </label>
                                <input
                                    value={referalDiscount}
                                    onChange={(e: any) =>
                                        setReferalDiscount(e.target.value)
                                    }
                                    type="number"
                                    placeholder="Referal Discount (%)"
                                    className="  h-[50px] bg-transparent border border-[#999999]  outline-none p-3 "
                                />
                            </div>

                            {/*  */}

                            <div className=" flex flex-row gap-20 px-2">
                                <div className=" gap-2 flex flex-row items-center align-center form-control">
                                    <span className="label-text">
                                        {" "}
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="checkbox checkbox-secondary w-7 h-7"
                                        />
                                    </span>

                                    <label className="cursor-pointer label -mt-2">
                                        {" "}
                                        DAO
                                    </label>
                                </div>

                                <div className=" gap-2 flex flex-row items-center align-center form-control">
                                    <span className="label-text">
                                        {" "}
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="checkbox checkbox-secondary w-7 h-7"
                                        />
                                    </span>

                                    <label className="cursor-pointer label -mt-2">
                                        Referral
                                    </label>
                                </div>
                            </div>

                            {/*  */}

                            <div className="flex flex-col space-y-1 mt-6">
                                <label htmlFor="companyLogo">
                                    Upload Event Logo/Flyer to IPFS
                                </label>
                                <div className="flex justify-center gap-3">
                                    <input
                                        onChange={(e: any) =>
                                            updateNewFile(e.target.files[0])
                                        }
                                        type="file"
                                        accept="image/x-png,image/gif,image/jpeg"
                                        alt="Company Logo"
                                        className="w-full  border px-1 py-2"
                                        placeholder="Upload Logo Company Logo to IPFS"
                                    />
                                    <button
                                        disabled={ipfsLoading}
                                        onClick={() => uploadIPFS()}
                                        className=" w-full  bg-gradient-to-r from-[#5522CC] to-[#8352f5] rounded-md text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-lg font-semibold"
                                    >
                                        {ipfsLoading
                                            ? "Uploading"
                                            : "IPFS Upload"}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1 mt-6">
                                <label htmlFor="companyLogo">
                                    Upload Event NFT to IPFS
                                </label>
                                <div className="flex justify-center gap-3">
                                    <input
                                        onChange={(e: any) =>
                                            updateNewFile(e.target.files[0])
                                        }
                                        type="file"
                                        accept="image/x-png,image/gif,image/jpeg"
                                        alt="Company Logo"
                                        className="w-full  border px-1 py-2"
                                        placeholder="Upload Logo Company Logo to IPFS"
                                    />
                                    <button
                                        disabled={ipfsLoading}
                                        onClick={() => uploadIPFS()}
                                        className=" w-full bg-gradient-to-r from-[#5522CC] to-[#8352f5] rounded-md text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]   text-lg font-semibold"
                                    >
                                        {ipfsLoading
                                            ? "Uploading"
                                            : "IPFS Upload"}
                                    </button>
                                </div>
                            </div>

                            {fileUrl !== "" && (
                                <div className="grid space-y-2 mt-4">
                                    <label>Uploaded Logo Link</label>
                                    <input
                                        value={fileUrl}
                                        disabled
                                        type="text"
                                        className="input input-bordered text-black  border-[#696969] w-full max-w-full bg-white disabled:bg-white"
                                    />
                                </div>
                            )}

                            {fileUrl !== "" && (
                                <div className="grid space-y-2 mt-4">
                                    <label>Uploaded NFT Link</label>
                                    <input
                                        value={fileUrl}
                                        disabled
                                        type="text"
                                        className="input input-bordered text-black  border-[#696969] w-full max-w-full bg-white disabled:bg-white"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex mt-4  w-full pb-10">
                            {/* <button
                            type="submit"
                            disabled={!ipfsUpload || isSubmitLoading}
                            className={`${
                                ipfsUpload || !isSubmitLoading
                                    ? "bg-white text-black"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            } justify-center text-2xl items-center mt-12 btn text-md font-semibold w-full py-3 -lg transition-colors duration-300 ease-in-out hover:bg-[#09143f] hover:text-white`}
                        >
                            {isSubmitLoading ? "Processing" : "Create Event"}
                        </button> */}

                            <button className="w-full  bg-gradient-to-r from-[#5522CC] to-[#8352f5] rounded-md text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]  text-2xl py-2 font-semibold hover:bg-[#09143f] ">
                                {" "}
                                Create Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="w-full bg-[#EEE1FF] h-10"></div>
        </>
    );
};

export default CreateEvent;
