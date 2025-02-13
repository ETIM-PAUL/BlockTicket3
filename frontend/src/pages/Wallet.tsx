// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React, { FC, useEffect } from "react";

import { GraphQLProvider } from "../GraphQL";
import { Transfers } from "../Transfers";

//import "./App.css";
import { Balance } from "../Balance";
import { SimpleGrid } from "@chakra-ui/react";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { useWallets } from "@web3-onboard/react";
import { useNavigate } from "react-router";
import { DappAddress } from "../constants";

const Wallet: FC = () => {
    const [connectedWallet] = useWallets();
    const navigate = useNavigate();
    useEffect(() => {
        if (!connectedWallet) {
            toast.error("Wallet not connected");
            navigate("/");
        }
    },);

    return (
        <>
            <TopNav />
            <div className=" bg-gradient-to-l from-[#5522CC] to-[#ED4690] ">
                <div className="w-full bg-[#EEE1FF] h-2"></div>
                {connectedWallet && (
                    <GraphQLProvider>
                        <SimpleGrid className="bg-white border my-4 rounded-t-[8px] w-[90%] md:max-w-[70%] mx-auto ">
                            <Balance />
                            <Transfers dappAddress={DappAddress} />
                        </SimpleGrid>
                    </GraphQLProvider>
                )}
                <div className="w-full bg-[#EEE1FF] h-2"></div>
            </div>
            <Footer />
        </>
    );
};

export default Wallet;
