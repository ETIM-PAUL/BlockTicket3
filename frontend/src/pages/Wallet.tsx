// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { FC } from "react";
import { useState } from "react";

import { GraphQLProvider } from "../GraphQL";
import { Notices } from "../Notices";
import { Transfers } from "../Transfers";
import { Inspect } from "../Inspect";
import { Network } from "../Network";
import { Vouchers } from "../Vouchers";
import { Reports } from "../Reports";

//import "./App.css";
import { Balance } from "../Balance";
import { SimpleGrid } from "@chakra-ui/react"
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";


const Wallet: FC = () => {
    const [dappAddress, setDappAddress] = useState<string>("0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C");

    return (
        <>
            <TopNav />
            <div className="w-full bg-[#EEE1FF] h-2"></div>
            <SimpleGrid columns={1} marginLeft={'25%'} marginRight={'25%'}>
                {/* <Network /> */}
                <br />
                <Balance />
                <br /> <br />
                <Transfers dappAddress={dappAddress} />
                <br /> <br />
            </SimpleGrid>

            <div className="w-full bg-[#EEE1FF] h-2"></div>
            <Footer />
        </>
    );
};

export default Wallet;