import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useConnectWallet, useWallets } from "@web3-onboard/react";
import { toast } from "react-toastify";
import { isAddress } from "@ethersproject/address";
import { ethers } from "ethers";
import { useRollups } from "./useRollups";
import { GraphQLProvider } from "./GraphQL";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import TopNav from "./layout/TopNav";

const App = () => {
    const [ethAddress, setEthAddress] = useState("");
    const [selected, setSelected] = useState("ether_dep");
    const [amount, setAmount] = useState();
    const [{ wallet }, connect] = useConnectWallet();
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [connectedWallet] = useWallets();
    const provider = wallet?.accounts
        ? new ethers.providers.Web3Provider(connectedWallet.provider)
        : null;
    const schema = yup
        .object({
            dapp: yup.string(),
            to: yup.string(),
            amount: yup.string(),
            erc20: yup.string(),
        })
        .required();
    const {
        register,
        handleSubmit,
        setError,
        getValues,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const rollups = useRollups("0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C");
    useEffect(() => {}, []);

    const sendTransaction = async (data) => {
        if (!isAddress(data.dapp)) {
            toast.error("Invalid address value");
            return;
        }
        try {
            setIsSubmitLoading(true);

            if (rollups) {
                let str = `{"method":"ether_deposit","amount":${ethers.utils.parseEther(
                    data.amount
                )}}`;
                let payload = ethers.utils.toUtf8Bytes(str);

                const result = await rollups.inputContract.addInput(
                    data.dapp,
                    payload
                );
                console.log("waiting for confirmation...");

                const receipt = await result.wait(1);
                toast("Your transaction has been received is being processed");
                setIsSubmitLoading(false);
                reset();
                // Search for the InputAdded event
                const event = receipt.events?.find(
                    (e) => e.event === "InputAdded"
                );
            }
        } catch (error) {
            setIsSubmitLoading(false);
            if (error.data.request.method == "eth_blockNumber") {
                toast.error("Backend is not running");
            }
            setError("name", {
                type: "manual",
                message: error.message,
            });
        }
    };
    const etherTrf = async (data) => {
        if (!isAddress(data.dapp)) {
            toast.error("Invalid receiver value");
            return;
        }
        try {
            setIsSubmitLoading(true);

            if (rollups) {
                let str = `{"method":"ether_transfer","to":${
                    data.to
                },"amount":${ethers.utils.parseEther(data.amount)}}`;
                let payload = ethers.utils.toUtf8Bytes(str);

                const result = await rollups.inputContract.addInput(payload);
                console.log("waiting for confirmation...");
                const receipt = await result.wait(1);
                reset();
                // Search for the InputAdded event
                const event = receipt.events?.find(
                    (e) => e.event === "InputAdded"
                );
                toast("Ether Transfered sucessfully");
                setIsSubmitLoading(false);
            }
        } catch (error) {
            setIsSubmitLoading(false);
            console.log("Error", error);
            setError("name", {
                type: "manual",
                message: error.message,
            });
        }
    };
    const etherWit = async (data) => {
        if (!isAddress(data.dapp)) {
            toast.error("Invalid address value");
            return;
        }
        try {
            setIsSubmitLoading(true);

            if (rollups) {
                let str = `{"method":"ether_deposit","dapp":${
                    data.dapp
                },"amount":${ethers.utils.parseEther(data.amount)}}`;
                let payload = ethers.utils.toUtf8Bytes(str);

                const result = await rollups.inputContract.addInput(payload);
                console.log("waiting for confirmation...");
                const receipt = await result.wait(1);
                reset();
                // Search for the InputAdded event
                const event = receipt.events?.find(
                    (e) => e.event === "InputAdded"
                );
                toast("Ether Deposited sucessfully");
                setIsSubmitLoading(false);
            }
        } catch (error) {
            setIsSubmitLoading(false);
            console.log("Error", error);
            setError("name", {
                type: "manual",
                message: error.message,
            });
        }
    };

    const erc20Transfer = async (data) => {
        if (!isAddress(data.dapp)) {
            toast.error("Invalid address value");
            return;
        }
        try {
            setIsSubmitLoading(true);

            if (rollups) {
                let str = `{"method":"erc_transfer","from":${
                    wallet.accounts[0].address
                },"to":${data?.dapp},"erc20":${
                    data?.erc20
                },"amount":${ethers.utils.parseEther(amount)}}`;
                let payload = ethers.utils.toUtf8Bytes(str);

                const result = await rollups.inputContract.addInput(payload);
                console.log("waiting for confirmation...");
                console.log("waiting for confirmation...");
                console.log("result", result);
                const receipt = await result.wait(1);
                toast("Your transaction has been received is being processed");
                setIsSubmitLoading(false);
                reset();
                // toast("Ether Deposited sucessfully");
                // setIsSubmitLoading(false)
                // Search for the InputAdded event
                const event = receipt.events?.find(
                    (e) => e.event === "InputAdded"
                );
            }
        } catch (error) {
            setIsSubmitLoading(false);
            console.log("Error", error);
            setError("name", {
                type: "manual",
                message: error.message,
            });
        }
    };

    const erc20Withdraw = async (data) => {
        if (!isAddress(data.erc20)) {
            toast.error("Invalid ERC20 address value");
            return;
        }
        try {
            setIsSubmitLoading(true);

            if (rollups) {
                let str = `{"method":"erc_withdraw","from":${
                    data.dapp
                },"erc20":${data?.erc20},"amount":${ethers.utils.parseEther(
                    amount
                )}}`;
                let payload = ethers.utils.toUtf8Bytes(str);

                const result = await rollups.inputContract.addInput(payload);
                console.log("waiting for confirmation...");
                const receipt = await result.wait(1);
                reset();
                // Search for the InputAdded event
                const event = receipt.events?.find(
                    (e) => e.event === "InputAdded"
                );
                toast("Ether Deposited sucessfully");
                setIsSubmitLoading(false);
            }
        } catch (error) {
            setIsSubmitLoading(false);
            console.log("Error", error);
            setError("name", {
                type: "manual",
                message: error.message,
            });
        }
    };

    return (
        <div className="App bg-white h-screen">
            <TopNav />
            <span className="text-black font-bold text-lg md:text-2xl text-center block w-full mt-3">
                Please connect your wallet to proceed
            </span>

            <GraphQLProvider>
                <span className="text-white text-lg md:text-2xl text-center block w-full font-bold">
                    BlockTicket3
                </span>
                <select
                    onChange={(e) => setSelected(e.target.value)}
                    className="select select-bordered mx-auto grid mt-5 w-[300px]"
                >
                    <option disabled value="">
                        --Please Select an option--
                    </option>
                    <option value="ether_dep">Ether Deposit</option>
                    <option value="erc_dep">ERC20 Deposit</option>
                    <option value="ether_wit">Ether Withdraw</option>
                    <option value="ether_trf">Ether Transfer</option>
                    <option value="erc_trf">ERC20 Transfer</option>
                    <option value="erc_with">ERC20 Withdraw</option>
                </select>

                {selected === "ether_dep" && (
                    <form
                        onSubmit={handleSubmit(sendTransaction)}
                        className="border-gray-200 bg-gray-900 w-full md:max-w-2xl mx-auto mt-10 h-fit py-10"
                    >
                        <div>
                            <div className="px-4 pb-4 mt-10">
                                <span className="text-white text-lg md:text-2xl text-center block w-full font-bold">
                                    Deposit Ether
                                </span>
                            </div>
                            <div className="pt-4 max-w-sm mx-auto">
                                <div className="inline-grid w-full">
                                    <label className="text-white font-medium text-lg pb-1">
                                        Dapp Address
                                    </label>
                                    <input
                                        {...register("dapp")}
                                        onChange={(e) =>
                                            setEthAddress(e.target.value)
                                        }
                                        className="h-12 w-full py-1 px-3 border rounded-md focus:outline-none"
                                        placeholder="Enter dapp address"
                                    />
                                </div>
                                <div className="inline-grid w-full mt-4">
                                    <label className="text-white font-medium text-lg pb-1">
                                        Ether Amount
                                    </label>

                                    <div className="flex relative">
                                        <input
                                            {...register("amount")}
                                            onChange={(e) =>
                                                setAmount(e.target.value)
                                            }
                                            type="number"
                                            className="h-12 w-full py-1 px-3 border rounded-md focus:outline-none appearance-none"
                                            placeholder="Enter Ether amount"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="max-w-sm mx-auto mt-12">
                                {!wallet?.accounts ? (
                                    <button
                                        type="button"
                                        onClick={() => connect()}
                                        className={`bg-blue-500 w-full h-12 text-white font-bold text-xl rounded-md`}
                                    >
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <button
                                        disabled={isSubmitLoading}
                                        type="submit"
                                        className={`bg-black w-full h-12 text-white font-bold text-xl rounded-md disabled:opacity-30`}
                                    >
                                        {isSubmitLoading
                                            ? "Loading"
                                            : "Process"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                )}

                {selected === "ether_trf" && (
                    <form
                        onSubmit={handleSubmit(etherTrf)}
                        className="border-gray-200 bg-gray-900 w-full md:max-w-2xl mx-auto mt-10 h-fit py-10"
                    >
                        <div>
                            <div className="px-4 pb-4 mt-10">
                                <span className="text-white text-lg md:text-2xl text-center block w-full font-bold">
                                    Deposit ERC20
                                </span>
                            </div>
                            <div className="pt-4 max-w-sm mx-auto">
                                <div className="inline-grid w-full">
                                    <label className="text-white font-medium text-lg pb-1">
                                        Receiver Address
                                    </label>
                                    <input
                                        {...register("to")}
                                        className="h-12 w-full py-1 px-3 border rounded-md focus:outline-none"
                                        placeholder="Enter erc20 address"
                                    />
                                </div>
                                <div className="inline-grid w-full mt-4">
                                    <label className="text-white font-medium text-lg pb-1">
                                        Ether Amount
                                    </label>

                                    <div className="flex relative">
                                        <input
                                            {...register("amount")}
                                            type="number"
                                            className="h-12 w-full py-1 px-3 border rounded-md focus:outline-none appearance-none"
                                            placeholder="Enter Ether amount"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="max-w-sm mx-auto mt-12">
                                {!wallet?.accounts ? (
                                    <button
                                        type="button"
                                        onClick={() => connect()}
                                        className={`bg-blue-500 w-full h-12 text-white font-bold text-xl rounded-md`}
                                    >
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <button
                                        disabled={isSubmitLoading}
                                        type="submit"
                                        className={`bg-black w-full h-12 text-white font-bold text-xl rounded-md disabled:opacity-30`}
                                    >
                                        {isSubmitLoading
                                            ? "Loading"
                                            : "Process"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                )}

                {selected === "ether_wit" && (
                    <form
                        onSubmit={handleSubmit(etherWit)}
                        className="border-gray-200 bg-gray-900 w-full md:max-w-2xl mx-auto mt-10 h-fit py-10"
                    >
                        <div>
                            <div className="px-4 pb-4 mt-10">
                                <span className="text-white text-lg md:text-2xl text-center block w-full font-bold">
                                    Withdraw Ether
                                </span>
                            </div>
                            <div className="pt-4 max-w-sm mx-auto">
                                <div className="inline-grid w-full">
                                    <label className="text-white font-medium text-lg pb-1">
                                        Rollup Address
                                    </label>
                                    <input
                                        {...register("dapp")}
                                        className="h-12 w-full py-1 px-3 border rounded-md focus:outline-none"
                                        placeholder="Enter rollup address"
                                    />
                                </div>
                                <div className="inline-grid w-full mt-4">
                                    <label className="text-white font-medium text-lg pb-1">
                                        Ether Amount
                                    </label>

                                    <div className="flex relative">
                                        <input
                                            {...register("amount")}
                                            type="number"
                                            className="h-12 w-full py-1 px-3 border rounded-md focus:outline-none appearance-none"
                                            placeholder="Enter Ether amount"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="max-w-sm mx-auto mt-12">
                                {!wallet?.accounts ? (
                                    <button
                                        type="button"
                                        onClick={() => connect()}
                                        className={`bg-blue-500 w-full h-12 text-white font-bold text-xl rounded-md`}
                                    >
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <button
                                        disabled={isSubmitLoading}
                                        type="submit"
                                        className={`bg-black w-full h-12 text-white font-bold text-xl rounded-md disabled:opacity-30`}
                                    >
                                        {isSubmitLoading
                                            ? "Loading"
                                            : "Process"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                )}

                {selected === "erc_dep" && (
                    <form
                        onSubmit={handleSubmit(sendTransaction)}
                        className="border-gray-200 bg-gray-900 w-full md:max-w-2xl mx-auto mt-10 h-fit py-10"
                    >
                        <div>
                            <div className="px-4 pb-4 mt-10">
                                <span className="text-white text-lg md:text-2xl text-center block w-full font-bold">
                                    Transfer Ether
                                </span>
                            </div>
                            <div className="pt-4 max-w-sm mx-auto">
                                <div className="inline-grid w-full">
                                    <label className="text-white font-medium text-lg pb-1">
                                        Dapp Address
                                    </label>
                                    <input
                                        value={ethAddress}
                                        onChange={(e) =>
                                            setEthAddress(e.target.value)
                                        }
                                        className="h-12 w-full py-1 px-3 border rounded-md focus:outline-none"
                                        placeholder="Enter dapp address"
                                    />
                                </div>
                                <div className="inline-grid w-full mt-4">
                                    <label className="text-white font-medium text-lg pb-1">
                                        Ether Amount
                                    </label>

                                    <div className="flex relative">
                                        <input
                                            value={amount}
                                            onChange={(e) =>
                                                setAmount(e.target.value)
                                            }
                                            type="number"
                                            className="h-12 w-full py-1 px-3 border rounded-md focus:outline-none appearance-none"
                                            placeholder="Enter Ether amount"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="max-w-sm mx-auto mt-12">
                                {!wallet?.accounts ? (
                                    <button
                                        type="button"
                                        onClick={() => connect()}
                                        className={`bg-blue-500 w-full h-12 text-white font-bold text-xl rounded-md`}
                                    >
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <button
                                        disabled={isSubmitLoading}
                                        type="submit"
                                        className={`bg-black w-full h-12 text-white font-bold text-xl rounded-md disabled:opacity-30`}
                                    >
                                        {isSubmitLoading
                                            ? "Loading"
                                            : "Process"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                )}

                {selected === "erc_trf" && (
                    <form
                        onSubmit={handleSubmit(erc20Transfer)}
                        className="border-gray-200 bg-gray-900 w-full md:max-w-2xl mx-auto mt-20 h-fit py-10"
                    >
                        <div>
                            <div className="px-4 pb-4 mt-10">
                                <span className="text-white text-lg md:text-2xl text-center block w-full font-bold">
                                    ERC20 Transfer
                                </span>
                            </div>
                            <div className="pt-4 max-w-sm mx-auto">
                                <div className="inline-grid w-full">
                                    <label className="text-white font-medium text-lg pb-1">
                                        Receiver Address
                                    </label>
                                    <input
                                        {...register("to")}
                                        className="h-12 w-full py-1 px-3 border rounded-md focus:outline-none"
                                        placeholder="Enter receiver address"
                                    />
                                </div>
                                <div className="inline-grid w-full mt-4">
                                    <label className="text-white font-medium text-lg pb-1">
                                        ERC20 Amount
                                    </label>

                                    <div className="flex relative">
                                        <input
                                            {...register("amount")}
                                            type="number"
                                            className="h-12 w-full py-1 px-3 border rounded-md focus:outline-none appearance-none"
                                            placeholder="Enter erc20 amount in the erc20 units"
                                        />
                                    </div>
                                </div>
                                <div className="inline-grid w-full">
                                    <label className="text-white font-medium text-lg pb-1">
                                        ERC20 Address
                                    </label>
                                    <input
                                        {...register("erc20")}
                                        className="h-12 w-full py-1 px-3 border rounded-md focus:outline-none"
                                        placeholder="Enter erc20 address"
                                    />
                                </div>
                            </div>
                            <div className="max-w-sm mx-auto mt-12">
                                {!wallet?.accounts ? (
                                    <button
                                        type="button"
                                        onClick={() => connect()}
                                        className={`bg-blue-500 w-full h-12 text-white font-bold text-xl rounded-md`}
                                    >
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <button
                                        disabled={isSubmitLoading}
                                        type="submit"
                                        className={`bg-black w-full h-12 text-white font-bold text-xl rounded-md disabled:opacity-30`}
                                    >
                                        {isSubmitLoading
                                            ? "Loading"
                                            : "Process"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                )}

                {selected === "erc_with" && (
                    <form
                        onSubmit={handleSubmit(erc20Withdraw)}
                        className="border-gray-200 bg-gray-900 w-full md:max-w-2xl mx-auto mt-20 h-fit py-10"
                    >
                        <div>
                            <div className="px-4 pb-4 mt-10">
                                <span className="text-white text-lg md:text-2xl text-center block w-full font-bold">
                                    ERC20 Withdraw
                                </span>
                            </div>
                            <div className="pt-4 max-w-sm mx-auto">
                                {/* <div className='inline-grid w-full'>
                <label className='text-white font-medium text-lg pb-1'>Dapp Address</label>
                <input {...register("dapp")} className='h-12 w-full py-1 px-3 border rounded-md focus:outline-none' placeholder='Enter dapp address' />
              </div> */}
                                <div className="inline-grid w-full">
                                    <label className="text-white font-medium text-lg pb-1">
                                        ERC20 Address
                                    </label>
                                    <input
                                        {...register("erc20")}
                                        className="h-12 w-full py-1 px-3 border rounded-md focus:outline-none"
                                        placeholder="Enter erc20 address"
                                    />
                                </div>
                                <div className="inline-grid w-full mt-4">
                                    <label className="text-white font-medium text-lg pb-1">
                                        ERC20 Amount
                                    </label>

                                    <div className="flex relative">
                                        <input
                                            {...register("amount")}
                                            type="number"
                                            className="h-12 w-full py-1 px-3 border rounded-md focus:outline-none appearance-none"
                                            placeholder="Enter Ether amount"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="max-w-sm mx-auto mt-12">
                                {!wallet?.accounts ? (
                                    <button
                                        type="button"
                                        onClick={() => connect()}
                                        className={`bg-blue-500 w-full h-12 text-white font-bold text-xl rounded-md`}
                                    >
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <button
                                        disabled={isSubmitLoading}
                                        type="submit"
                                        className={`bg-black w-full h-12 text-white font-bold text-xl rounded-md disabled:opacity-30`}
                                    >
                                        {isSubmitLoading
                                            ? "Loading"
                                            : "Process"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </GraphQLProvider>

            <div>
                {/* <MainNav /> */}
                <HomePage />

                <Footer />
            </div>
        </div>
    );
};

export default App;
