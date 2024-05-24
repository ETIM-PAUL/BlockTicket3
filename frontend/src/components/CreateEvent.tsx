import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { bgImage } from "../assets";
import TopNav from "./TopNav";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { useRollups } from "../useRollups";
import { DappAddress } from "../constants";
import { useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";
import configFile from "../config.json";
import { GlobalContext } from "../context/GlobalContext";

type Props = {};
interface Report {
    payload: string;
}
const config: any = configFile;
interface TicketTypes {
    id: number;
    ticketType: string;
    price: number;
}

const CreateEvent = (props: Props) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState('');
    const [minReferal, setMinReferal] = useState(0);
    const [referalDiscount, setReferalDiscount] = useState(0);
    const [ticketType, setTicketType] = useState('');
    const [price, setPrice] = useState(0);
    const [ticketTypes, setTicketTypes] = useState<Array<TicketTypes>>([]);
    const [dao, setDao] = useState("false");
    const [referral, setReferral] = useState("false");
    const rollups = useRollups(DappAddress);
    const [connectedWallet] = useWallets();
    const [{ connectedChain }] = useSetChain();
    const [postData, setPostData] = useState<boolean>(false);

    //Event Logo
    const [logoUrl, updateLogoUrl] = useState("");
    const [logoFile, updateLogoFile] = useState("");
    const [logoIpfsLoading, setLogoIpfsLoading] = useState(false);
    const { state, dispatch }: any = useContext(GlobalContext);

    const [{ wallet }] = useConnectWallet();
    const [balance, setBalance] = useState<string>(state?.balance)
    const navigate = useNavigate();


    //Event NFT
    const [nftUrl, updateNftUrl] = useState("");
    const [nftFile, updateNftFile] = useState("");
    const [nftIpfsLoading, setNftIpfsLoading] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    // const getBalance = async (str: string) => {
    //     let payload = str;

    //     if (!connectedChain) {
    //         return;
    //     }

    //     let apiURL = ""

    //     if (config[connectedChain.id]?.inspectAPIURL) {
    //         apiURL = `${config[connectedChain.id].inspectAPIURL}/inspect`;
    //     } else {
    //         console.error(`No inspect interface defined for chain ${connectedChain.id}`);
    //         return;
    //     }

    //     let fetchData: Promise<Response>;
    //     if (postData) {
    //         const payloadBlob = new TextEncoder().encode(payload);
    //         fetchData = fetch(`${apiURL}`, { method: 'POST', body: payloadBlob });
    //     } else {
    //         fetchData = fetch(`${apiURL}/${payload}`);
    //     }
    //     fetchData
    //         .then(response => response.json())
    //         .then(data => {
    //             // Decode payload from each report
    //             const decode = data.reports.map((report: Report) => {
    //                 return ethers.utils.toUtf8String(report.payload);
    //             });
    //             const reportData: any = JSON.parse(decode)
    //             setBalance(ethers.utils.formatEther(reportData?.ether))
    //         });
    // };

    async function uploadNftIPFS() {
        const file = nftFile;
        try {
            if (file !== undefined) {
                setNftIpfsLoading(true);
                const formData = new FormData();
                formData.append("file", file);
                const pinataBody = {
                    options: {
                        cidVersion: 1,
                    },
                };
                formData.append(
                    "pinataOptions",
                    JSON.stringify(pinataBody.options)
                );

                const url = `${pinataConfig.root}/pinning/pinFileToIPFS`;
                const response = await axios({
                    method: "post",
                    url: url,
                    data: formData,
                    headers: pinataConfig.headers,
                });
                updateNftUrl(`ipfs://${response.data.IpfsHash}/`);
                queryPinataFiles();
                setNftIpfsLoading(false);
                return `ipfs://${response.data.IpfsHash}/`;
            } else {
                // toast.error("Please upload a document detailing the project outlines, aims and objectives");
                setNftIpfsLoading(false);
                return;
            }
        } catch (error) {
            setNftIpfsLoading(false);
            console.log(error);
        }
    }
    async function uploadIPFS() {
        const file = logoFile;
        try {
            if (file !== undefined) {
                setLogoIpfsLoading(true);
                const formData = new FormData();
                formData.append("file", file);
                const pinataBody = {
                    options: {
                        cidVersion: 1,
                    },
                };
                formData.append(
                    "pinataOptions",
                    JSON.stringify(pinataBody.options)
                );

                const url = `${pinataConfig.root}/pinning/pinFileToIPFS`;
                const response = await axios({
                    method: "post",
                    url: url,
                    data: formData,
                    headers: pinataConfig.headers,
                });
                updateLogoUrl(`ipfs://${response.data.IpfsHash}/`);
                queryPinataFiles();
                setLogoIpfsLoading(false);
                return `ipfs://${response.data.IpfsHash}/`;
            } else {
                // toast.error("Please upload a document detailing the project outlines, aims and objectives");
                setLogoIpfsLoading(false);
                return;
            }
        } catch (error) {
            setLogoIpfsLoading(false);
            console.log(error);
        }
    }

    async function createEvent() {
        let creation_price: number = 0;

        if (Number(balance) < 0.06 && referral === "true") {
            toast.error("Insufficient Funds for Referral based Event. Please Deposit into the DAPP")
            return;
        } else {
            creation_price = 0.06
        }
        if (Number(balance) < 0.04 && dao === "true") {
            toast.error("Insufficient Funds for DAO based Event. Please Deposit into the DAPP")
            return;
        } else {
            creation_price = 0.04
        }
        if (Number(balance) < 0.02 && dao === "false" && referral === "false") {
            toast.error("Insufficient Funds for Normal Event. Please Deposit into the DAPP")
            return;
        } else {
            creation_price = 0.02
        }
        if (Number(balance) < 0.1 && dao === "true" && referral === "true") {
            toast.error("Insufficient Funds for Full-Packaged Event. Please Deposit into the DAPP")
            return;
        } else {
            creation_price = 0.1
        }

        if (!title || !date || !location || !capacity) {
            toast.error("Incomplete Event Details");
            return;
        }
        if (ticketTypes.length === 0) {
            toast.error("Incomplete Details (No Tickets)");
            return;
        }
        if (referral === "true" && minReferal < 1) {
            toast.error("Please add a minimum referral value greater than One(1)");
            return;
        }
        if (referral === "true" && referalDiscount < 1) {
            toast.error("Please add a referral discount value greater than One(1)");
            return;
        }
        try {
            if (rollups) {
                setIsSubmitLoading(true)
                try {
                    await uploadIPFS().then(async (logo) => {
                        console.log("logo", logo)
                        await uploadNftIPFS().then(async (nft) => {
                            console.log("nft", nft)

                            const payload = {
                                title,
                                date,
                                location,
                                ticketTypes: ticketTypes,
                                capacity: Number(capacity),
                                dao: dao === "true" ? true : false,
                                referral: referral === "true" ? true : false,
                                minReferal: Number(minReferal),
                                referalDiscount: Number(referalDiscount),
                                nftUrl: nft,
                                logoUrl: logo
                            }

                            let str = `{"action": "create_event", "title": "${payload.title}", "date": "${payload.date}", "location": "${payload.location}", "tickets": ${JSON.stringify(ticketTypes)}, "capacity": ${payload.capacity}, "organizer": "${wallet?.accounts[0]?.address}", "dao": ${payload.dao}, "referral": ${payload.referral}, "minReferrals": ${payload.minReferal}, "referralDiscount": ${payload.referalDiscount}, "tokenUrl": "${payload.nftUrl}", "logoUrl": "${payload.logoUrl}"}`
                            let data = ethers.utils.toUtf8Bytes(str);

                            const result = await rollups.inputContract.addInput(DappAddress, data);
                            const receipt = await result.wait(1);
                            // Search for the InputAdded event
                            const event = receipt.events?.find((e: any) => e.event === "InputAdded");
                            if (!event) {
                                throw new Error(
                                    `Event Creation Failed, Insufficient ETH in your Wallet`
                                );
                            } else {
                                dispatch({
                                    type: "SET_BALANCE",
                                    payload: (Number(state.balance) - Number(creation_price)).toString(),
                                });
                                setBalance(creation_price.toString())
                                dispatch({
                                    type: "APPEND_EVENTS",
                                    payload: { ...payload, "id": state?.events[state?.events.length - 1] ? state?.events[state?.events.length - 1].id + 1 : 1, "organizer": wallet?.accounts[0]?.address, "status": 0 },
                                });
                                setIsSubmitLoading(false)
                                toast("Event Created Successfully");
                                navigate("/events");
                            }
                        })
                    });
                }
                catch (e) {
                    setIsSubmitLoading(false)
                    console.log(e);
                }
            }
            setIsSubmitLoading(false)
        } catch (error) {
            setIsSubmitLoading(false)
            console.log("Error", error);
        }
    }

    const updateTickets = () => {
        if (!ticketType || !price) {
            toast.error("No Ticket Data");
            return;
        }
        if (ticketTypes.length === 3) {
            toast.error("Maximum Ticket Types Reached");
            return;
        }
        setTicketTypes([...ticketTypes, { id: ticketTypes.length + 1, ticketType, price }]);
        setTicketType('');
        setPrice(0);
    };

    const handleRemove = (id: number) => {
        setTicketTypes(ticketTypes.filter(item => item.id !== id));
        // Adjust ids of remaining items
        setTicketTypes(ticketTypes.map((item, index) => ({ ...item, id: index + 1 })));
    };

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
        // getBalance(`balance/${wallet?.accounts[0]?.address}`)
    });

    return (
        <>
            <TopNav />
            <div className="w-full bg-[#EEE1FF] h-2"></div>

            <div className="bg-white flex md:grid  md:grid-cols-2 ">
                <div className="hidden md:grid md:col-span relative bg-center bg-cover"
                    style={{ backgroundImage: `url(${bgImage})` }}
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#5522CC] to-[#ED4690] opacity-85"></div>

                    <div className="flex flex-row h-full z-100 justify-center mx-16 absolute items-center">
                        <div className="flex flex-col w-full">
                            <p className="font-bold text-lg md:text-3xl text-white sm:leading-[50px] leading-[20px] w-full text-center">
                                Ticketing and Event Management Made Easy{" "}
                            </p>
                            <p className="text-lg mt-3 text-white text-center">
                                Create your event, manage your ticketing, allow participants to create/vote proposals and give users referral
                                bonus for inviting the friends and fans to your event.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-spa bg-gradient-to-r from-[#5522CC] to-[#ED4690] md:px-6">
                    <div
                        className=" w-full shadow-2xl  px-6 rounded-lg  my-6 "
                    >
                        <div className="flex flex-col space-y-3 py-6 text-white">
                            <h2 className="text-2xl font-semibold  justify-center flex">
                                Create Event
                            </h2>

                            <div>
                                <ul className="text-red-500 text-[14px] font-bold">
                                    <li>Normal Event - 0.02ETH</li>
                                    <li>DAO Event - 0.04ETH</li>
                                    <li>Referral Event - 0.06ETH</li>
                                    <li>Full-Package Event - 0.1ETH</li>
                                </ul>
                            </div>

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
                                <label htmlFor="date">Start Date</label>
                                <input
                                    value={date}
                                    onChange={(e: any) =>
                                        setDate(e.target.value)
                                    }
                                    type="datetime-local"
                                    placeholder="Event Date"
                                    required
                                    className="h-[50px] bg-transparent border border-[#999999]  outline-none p-3 "
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


                            <div className="border p-2">
                                <div className="flex space-x-2 w-full">
                                    <input
                                        type="text"
                                        value={ticketType}
                                        onChange={(e) => setTicketType(e.target.value)}
                                        placeholder="Ticket Type"
                                        className="  h-[50px] w-full bg-transparent border border-[#999999]  outline-none p-3"
                                    />
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        placeholder="Ticket Price in ETH"
                                        className="  h-[50px] w-full bg-transparent border border-[#999999]  outline-none p-3"
                                    />
                                </div>
                                <button onClick={() => updateTickets()}
                                    className=" w-full h-12 mt-2 disabled:cursor-not-allowed disabled:opacity-20  bg-gradient-to-r from-[#5522CC] to-[#8352f5] text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-md font-semibold"
                                >Add</button>
                                <ul className="mt-2">
                                    {ticketTypes.length > 0 && ticketTypes.map((item, index) => (
                                        <li key={index} className="mb-2">
                                            <span>{item.ticketType} - {item.price}ETH</span>
                                            <button onClick={() => handleRemove(item.id)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">Remove</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col gap space-y-1 ">
                                <label htmlFor="capacity">
                                    DAO Inclusive Event (Optional)
                                </label>
                                <select
                                    value={dao}
                                    onChange={(e) => setDao(e.target.value)}
                                    className="bg-transparent border border-[#999999]  outline-none p-3 "
                                >
                                    <option disabled>--Do want a DAO Inclusive Event--</option>
                                    <option value={"false"}>False</option>
                                    <option value={"true"}>True</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap space-y-1 ">
                                <label htmlFor="capacity">
                                    Referral Inclusive Event (Optional)
                                </label>
                                <select
                                    value={referral}
                                    onChange={(e) => setReferral(e.target.value)}
                                    required
                                    className="bg-transparent border border-[#999999]  outline-none p-3 "
                                >
                                    <option disabled>--Do want a Referral Inclusive Event--</option>
                                    <option value={"false"}>False</option>
                                    <option value={"true"}>True</option>
                                </select>
                            </div>

                            {/*  */}
                            <div className={`flex-col gap space-y-1 ${referral === "true" ? "flex" : "hidden"}`}>
                                <label htmlFor="minReferal">
                                    Minimum Referral
                                </label>
                                <input
                                    value={minReferal}
                                    onChange={(e: any) =>
                                        setMinReferal(e.target.value)
                                    }
                                    type="number"
                                    placeholder="Minimum referrals required to get a discount"
                                    className="h-[50px] appearance-none bg-transparent border border-[#999999]  outline-none p-3"
                                />
                            </div>
                            {/*  */}
                            <div className={`flex-col gap space-y-1 ${referral === "true" ? "flex" : "hidden"}`}>
                                <label htmlFor="refDiscount">
                                    Referral Discount
                                </label>
                                <input
                                    value={referalDiscount}
                                    onChange={(e: any) =>
                                        setReferalDiscount(e.target.value)
                                    }
                                    type="number"
                                    placeholder="Referral Discount (%)"
                                    className="h-[50px] appearance-none bg-transparent border border-[#999999]  outline-none p-3 "
                                />
                            </div>

                            {/*  */}

                            <div className="flex flex-col space-y-1 mt-6">
                                <label htmlFor="companyLogo">
                                    Upload Event Logo/Flyer
                                </label>
                                <div className="flex justify-center gap-3">
                                    <input
                                        onChange={(e: any) =>
                                            updateLogoFile(e.target.files[0])
                                        }
                                        type="file"
                                        accept="image/x-png,image/gif,image/jpeg"
                                        alt="Event Logo"
                                        className="w-full  border px-1 py-2"
                                        placeholder="Upload Event Logo to IPFS"
                                    />
                                    {/* <button
                                        disabled={logoIpfsLoading || logoFile === ""}
                                        onClick={() => uploadIPFS()}
                                        className="w-full disabled:cursor-not-allowed disabled:opacity-50 py-2 bg-gradient-to-r from-[#5522CC] to-[#8352f5] text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-md font-semibold"
                                    >
                                        {logoIpfsLoading
                                            ? "Uploading"
                                            : "Logo IPFS Upload"}
                                    </button> */}
                                </div>
                            </div>
                            {/* {logoUrl !== "" && (
                                <div className="grid space-y-2 mt-4">
                                    <label>Uploaded Logo Link</label>
                                    <input
                                        value={logoUrl}
                                        disabled
                                        type="text"
                                        className="h-[50px] bg-transparent border border-[#999999]  outline-none p-3 "
                                    />
                                </div>
                            )} */}

                            <div className="flex flex-col space-y-1 mt-6">
                                <label htmlFor="companyLogo">
                                    Upload Event NFT (POAP)
                                </label>
                                <div className="flex justify-center gap-3">
                                    <input
                                        onChange={(e: any) =>
                                            updateNftFile(e.target.files[0])
                                        }
                                        type="file"
                                        accept="image/x-png,image/gif,image/jpeg"
                                        alt="Company Logo"
                                        className="w-full  border px-1 py-2"
                                        placeholder="Upload Logo Company Logo to IPFS"
                                    />
                                    {/* <button
                                        disabled={nftIpfsLoading || nftFile === ""}
                                        onClick={() => uploadNftIPFS()}
                                        className=" w-full disabled:cursor-not-allowed disabled:opacity-50  bg-gradient-to-r from-[#5522CC] to-[#8352f5] text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-md font-semibold"
                                    >
                                        {nftIpfsLoading
                                            ? "Uploading"
                                            : "NFT IPFS Upload"}
                                    </button> */}
                                </div>
                            </div>
                            {/* {nftUrl !== "" && (
                                <div className="grid space-y-2 mt-4">
                                    <label>Uploaded NFT Link</label>
                                    <input
                                        value={nftUrl}
                                        disabled
                                        type="text"
                                        className="h-[50px] bg-transparent border border-[#999999]  outline-none p-3 "
                                    />
                                </div>
                            )} */}
                        </div>

                        <div className="flex mt-4  w-full pb-10">
                            <button
                                onClick={() => createEvent()}
                                type="submit"
                                disabled={isSubmitLoading || logoIpfsLoading || nftIpfsLoading}
                                className={`${(!isSubmitLoading || !logoIpfsLoading || !nftIpfsLoading)
                                    ? " bg-gradient-to-r from-[#5522CC] to-[#8352f5]"
                                    : "bg-gray-300 text-white cursor-not-allowed"
                                    } py-3 w-full disabled:cursor-not-allowed disabled:opacity-50  bg-gradient-to-r from-[#5522CC] to-[#8352f5] text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-md font-semibold`}
                            >
                                {isSubmitLoading ? "Processing" :
                                    connectedWallet ? "Create Event" : "Connect Wallet"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-[#EEE1FF] h-2"></div>
        </>
    );
};

export default CreateEvent;
