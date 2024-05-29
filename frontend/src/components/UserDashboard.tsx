import React, { useEffect, useState } from "react";
import MyEvents from "./MyEvents";
import MyEventsTickets from "./MyEventsTickets";
import { useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";
import configFile from "../config.json";
import { ethers } from "ethers";
import { ERC721Address } from "../constants";
import { erc721abi } from "../constants/erc721";

const config: any = configFile;
type Props = {};
interface Report {
    payload: string;
}
const UserDashboard = (props: Props) => {
    const [showEventTicketTable, setShowEventTicketTable] = useState(false);
    const [showEvents, setShowEvents] = useState(false);
    const [showDashboard, setShowDasboard] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userNfts, setUserNfts] = useState<any>([]);
    const [userData, setUserData] = useState<any>();
    const [{ connectedChain }] = useSetChain();
    const [postData, setPostData] = useState<boolean>(false);
    const [{ wallet }] = useConnectWallet();
    const [connectedWallet] = useWallets();


    const fetchUserData = async (str: string) => {
        setLoading(true);
        let payload = str;
        if (!connectedChain) {
            return;
        }

        let apiURL = "";

        if (config[connectedChain.id]?.inspectAPIURL) {
            apiURL = `${config[connectedChain.id].inspectAPIURL}/inspect`;
        } else {
            console.error(
                `No inspect interface defined for chain ${connectedChain.id}`
            );
            return;
        }

        let fetchData: Promise<Response>;
        if (postData) {
            const payloadBlob = new TextEncoder().encode(payload);
            fetchData = fetch(`${apiURL}`, {
                method: "POST",
                body: payloadBlob,
            });
        } else {
            fetchData = fetch(`${apiURL}/${payload}`);
        }
        fetchData
            .then((response) => response.json())
            .then((data) => {
                // Decode payload from each report
                const decode = data.reports.map((report: Report) => {
                    return ethers.utils.toUtf8String(report.payload);
                });
                const reportData = decode && JSON.parse(decode);
                setUserData(reportData);
                setLoading(false);
            });
    };

    const fetchUserNFTs = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(connectedWallet.provider);
            const contract = new ethers.Contract(ERC721Address, erc721abi, provider);
            let tx = await contract.getNFTHolders();
            setUserNfts(tx.filter((nft: any) => nft["1"]?.toLowerCase() === wallet?.accounts[0]?.address))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUserData(`get_user_data/${wallet?.accounts[0]?.address}`);
        fetchUserNFTs();
    }, []);

    const showAllEvents = () => {
        setShowDasboard(false);
        setShowEvents(true);
        setShowEventTicketTable(false);
    };

    const showParticipant = () => {
        setShowDasboard(false);
        setShowEventTicketTable(true);
        setShowEvents(false);
    };

    return (
        <div className="h-full">
            <div className="w-full bg-[#EEE1FF] h-2"></div>

            <div className=" bg-gradient-to-l py-10 from-[#5522CC] to-[#ED4690] px-10 md:px-20 h-full">
                <div className="flex justify-end text-lg font-normal gap-6">
                    <button
                        className={`flex justify-center border border-bg-[#EEE1FF] py-2 px-4 w-fit text-black ${showEvents
                            ? "bg-white text-black"
                            : "bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                            } w-[130px] text-lg font-medium`}
                        onClick={showAllEvents}
                    >
                        My Events
                    </button>

                    <button
                        className={`flex justify-center border border-bg-[#EEE1FF] py-2 px-4 w-fit text-black ${showEventTicketTable
                            ? "bg-white "
                            : "bg-gradient-to-r from-[#5522CC] to-[#ED4690] text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                            } w-[130px] text-lg font-medium`}
                        onClick={showParticipant}
                    >
                        Tickets Purchased
                    </button>
                </div>

                {showDashboard && (
                    <div className="mt-0 md:my-10 w-full">
                        <div className="flex mt- flex-wrap md:gap-5 max-md:flex-col max-md:gap-0">
                            <div className="flex grow flex-col w-full md:w-[250px] max-md:ml-0 max-md:w-full">
                                <div className="flex flex-col grow justify-center text-white max-md:mt-10">
                                    <div className="flex flex-col items-start py-6 pr-20 pl-6 rounded-xl bg-white text-black max-md:px-5">
                                        <div className="flex flex-col justify-center p-4 text-sm font-bold leading-4 whitespace-nowrap rounded-lg bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
                                            <div className="flex py-1 items-center justify-center bg-white rounded-full h-8 w-8">
                                                E
                                            </div>
                                        </div>
                                        <div className="mt-1.5 text-base font-medium tracking-tight w-full">
                                            Events Created
                                        </div>
                                        <div className="mt-1.5 text-2xl font-extrabold">
                                            {userData?.user_events?.length ?? 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex grow flex-col w-full md:w-[250px] max-md:ml-0 max-md:w-full">
                                <div className="flex flex-col grow justify-center text-white max-md:mt-10">
                                    <div className="flex flex-col items-start py-6 pr-20 pl-6 rounded-xl bg-white text-black max-md:px-5">
                                        <div className="flex flex-col justify-center p-4 text-sm font-bold leading-4 whitespace-nowrap rounded-lg bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
                                            <div className="flex py-1 items-center justify-center bg-white rounded-full h-8 w-8">
                                                T
                                            </div>
                                        </div>
                                        <div className="mt-1.5 text-base font-medium tracking-tight w-full">
                                            Tickets Purchased
                                        </div>
                                        <div className="mt-1.5 text-2xl font-extrabold">
                                            {userData?.user_event_tickets
                                                ?.length ?? 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex grow flex-col w-full md:w-[250px] max-md:ml-0 max-md:w-full">
                                <div className="flex flex-col grow justify-center text-white max-md:mt-10">
                                    <div className="flex flex-col items-start py-6 pr-20 pl-6 rounded-xl bg-white text-black max-md:px-5">
                                        <div className="flex flex-col justify-center p-4 text-sm font-bold leading-4 whitespace-nowrap rounded-lg bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
                                            <div className="flex py-1 items-center justify-center bg-white rounded-full h-8 w-8">
                                                N
                                            </div>
                                        </div>
                                        <div className="mt-1.5 text-base font-medium tracking-tight w-full">
                                            Events NFT
                                        </div>
                                        <div className="mt-1.5 text-2xl font-extrabold">
                                            {userNfts?.length ?? 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex grow flex-col w-full md:w-[250px] max-md:ml-0 max-md:w-full">
                                <div className="flex flex-col grow justify-center text-white max-md:mt-10">
                                    <div className="flex flex-col items-start py-6 pr-20 pl-6 rounded-xl bg-white text-black max-md:px-5">
                                        <div className="flex flex-col justify-center p-4 text-sm font-bold leading-4 whitespace-nowrap rounded-lg bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
                                            <div className="flex py-1 items-center justify-center bg-white rounded-full h-8 w-8">
                                                R
                                            </div>
                                        </div>
                                        <div className="mt-1.5 text-base font-medium tracking-tight w-full">
                                            Total Referrals
                                        </div>
                                        <div className="mt-1.5 text-2xl font-extrabold">
                                            {userData?.user_event_referrals.filter(
                                                (item: any) => item.count > 0
                                            )?.length ?? 0}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex grow flex-col w-full md:w-[250px] max-md:ml-0 max-md:w-full">
                                <div className="flex flex-col grow justify-center text-white max-md:mt-10">
                                    <div className="flex flex-col items-start py-6 pr-20 pl-6 rounded-xl bg-white text-black max-md:px-5">
                                        <div className="flex flex-col justify-center p-4 text-sm font-bold leading-4 whitespace-nowrap rounded-lg bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
                                            <div className="flex py-1 items-center justify-center bg-white rounded-full h-8 w-8">
                                                P
                                            </div>
                                        </div>
                                        <div className="mt-1.5 text-base font-medium tracking-tight w-full">
                                            Total Proposals
                                        </div>
                                        <div className="mt-1.5 text-2xl font-extrabold">
                                            {userData?.user_event_proposals
                                                ?.length ?? 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!showDashboard && (
                    <div className="">
                        {showEventTicketTable && (
                            <MyEventsTickets
                                nfts={userNfts}
                                referrals={userData?.user_event_referrals}
                                tickets={userData?.user_event_tickets}
                                events={userData?.all_events}
                            />
                        )}
                        {showEvents && (
                            <MyEvents events={userData?.user_events} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
