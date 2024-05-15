import React from "react";
import { useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";
import configFile from "../config.json";
import { ethers } from "ethers";
import { onboard } from "..";

const config = configFile;

const WalletConnect = () => {
    const [{ wallet }, connect, disconnect] = useConnectWallet();
    const [{ connectedChain }, setChain] = useSetChain();

    const [connectedWallet] = useWallets();

    const switchNetwork = async () => {
        try {
            await setChain({ chainId: '0x7a69', chainNamespace: 'evm' })

        } catch (switchError) {
            console.log(switchError)
            // The network has not been added to MetaMask
            if (switchError.code === 4902) {
                console.log("Please add the Localhost network to MetaMask")
            }
            console.log("Cannot switch to the network")

        }
    }

    return (
        <div>
            {!wallet?.accounts && (
                <button
                    onClick={() => connect()}
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
                    onClick={() => switchNetwork(wallet)}
                    type="button"
                    className="font-medium rounded-lg text-base md:text-lg p-2 md:px-4 md:py-3 text-center bg-white text-black"
                >
                    ✂️ Wrong Network
                </button>
            )}
        </div>
    );
};

export default WalletConnect;
