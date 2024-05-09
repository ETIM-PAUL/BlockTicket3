import React from "react";
import { useConnectWallet } from "@web3-onboard/react";

const WalletConnect = () => {
    const [{ wallet }, connect, disconnect] = useConnectWallet();
    return (
        <div>
            {!wallet?.accounts ? (
                <button
                    onClick={() => connect()}
                    type="button"
                    className="font-medium rounded-lg text-xl p-2 md:px-4 md:py-3 text-center bg-white text-black"
                >
                    Connect Wallet
                </button>
            ) : (
                <button
                    onClick={() => disconnect(wallet)}
                    type="button"
                    className="font-medium rounded-lg text-lg p-2 md:px-4 md:py-3 text-center bg-white text-black"
                >
                    ✂️ Disconnect Wallet
                </button>
            )}
        </div>
    );
};

export default WalletConnect;
