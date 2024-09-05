import React, { useContext, useEffect, useState } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "../config.json";
import { GlobalContext } from "../context/GlobalContext";
import { ethers } from "ethers";


const config: any = configFile;

const WalletConnect = () => {
    const [{ wallet }, connect, disconnect]: any = useConnectWallet();
    const [{ connectedChain }, setChain]: any = useSetChain();
    const { state, dispatch }: any = useContext(GlobalContext);
    const [currentAccount, setAccount] = useState<any>(wallet?.accounts[0]?.address)

    const switchNetwork = async () => {
        try {
            await setChain({ chainId: '0xaa37dc', chainNamespace: 'evm', token: 'OptSep', rpcUrl: 'https://opt-sepolia.g.alchemy.com/v2/OaicbPo0w4HwmD9ThU22jiR0F39vq_mj' })
            dispatch({
                type: "SET_FETCHING",
                payload: !state?.fetching,
            });
        } catch (switchError: any) {
            // The network has not been added to MetaMask
            if (switchError.code === 4902) {
                console.log("Please add the Localhost network to MetaMask")
            }
            console.log("Cannot switch to the network")

        }
    }

    useEffect(() => {
        if (wallet?.accounts[0]) {
            setAccount(wallet?.accounts[0]?.address)
            const handleAccountsChanged = (accounts: any) => {
                if (accounts.length === 0) {
                    console.log('Please connect to a wallet.');
                } else {
                    getBalance(`balance/${accounts[0].address}`);
                }
            };
            if (currentAccount !== wallet?.accounts[0]?.address) {
                handleAccountsChanged(wallet?.accounts);
            }
        }
    }, [wallet && wallet?.accounts[0] && wallet?.accounts[0]?.address]);

    const getBalance = async (str: string) => {
        let payload = str;

        if (!connectedChain) {
            return;
        }

        let apiURL = ""

        if (config[connectedChain.id]?.inspectAPIURL) {
            apiURL = `${config[connectedChain.id].inspectAPIURL}/inspect`;
        } else {
            console.error(`No inspect interface defined for chain ${connectedChain.id}`);
            return;
        }

        let fetchData: Promise<Response>;

        fetchData = fetch(`${apiURL}/${payload}`);
        fetchData
            .then(response => response.json())
            .then(data => {
                // Decode payload from each report
                const decode = data.reports.map((report: { payload: string }) => {
                    return ethers.utils.toUtf8String(report.payload);
                });
                const reportData: any = JSON.parse(decode)
                dispatch({
                    type: "SET_BALANCE",
                    payload: ethers.utils.formatEther(reportData?.ether),
                });
            });
    };

    return (
        <div>
            {!wallet?.accounts && (
                <button
                    onClick={() => connect().then(() => dispatch({
                        type: "SET_FETCHING",
                        payload: !state?.fetching,
                    }))}
                    type="button"
                    className="font-medium rounded-lg text-xl p-2 md:px-4 md:py-3 text-center bg-white text-black"
                >
                    Connect Wallet
                </button>
            )}
            {(wallet?.accounts && config[connectedChain.id]?.inspectAPIURL) && (
                <button
                    onClick={() => disconnect(wallet)}
                    type="button"
                    className="font-medium rounded-lg text-base md:text-lg p-2 md:px-4 md:py-3 text-center bg-white text-black"
                >
                    ✂️ Disconnect Wallet
                </button>
            )}
            {(wallet?.accounts && !config[connectedChain.id]?.inspectAPIURL) && (
                <button
                    onClick={() => switchNetwork()}
                    type="button"
                    className="font-medium rounded-lg text-base md:text-lg p-2 md:px-4 md:py-3 text-center bg-red-500 text-white"
                >
                    ✂️ Wrong Network
                </button>
            )}
        </div>
    );
};

export default WalletConnect;
