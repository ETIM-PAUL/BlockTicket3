// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React, { useEffect, useState } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { ethers } from "ethers";
// import { useRollups } from "./useRollups";
import { BsClipboard2Fill } from "react-icons/bs";
import configFile from "./config.json";
import { parseEther } from "ethers/lib/utils";
//import "./App.css"
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Stack,
  Box,
  Spacer
} from '@chakra-ui/react'
import { shortenAddress } from "./utils";
import { toast } from "react-toastify";

const config: any = configFile;
interface Report {
  payload: string;
}

export const Balance: React.FC = () => {
  const [reports, setReports] = useState<string[]>([]);
  const [decodedReports, setDecodedReports] = useState<any>({});
  const [hexData, setHexData] = useState<boolean>(false);
  const [postData, setPostData] = useState<boolean>(false);

  // const rollups = useRollups();
  const [{ connectedChain }] = useSetChain();
  const [{ wallet }] = useConnectWallet();

  const inspectCall = async (str: string) => {
    let payload = str;
    if (hexData) {
      const uint8array = ethers.utils.arrayify(payload);
      payload = new TextDecoder().decode(uint8array);
    }
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
    if (postData) {
      const payloadBlob = new TextEncoder().encode(payload);
      fetchData = fetch(`${apiURL}`, { method: 'POST', body: payloadBlob });
    } else {
      fetchData = fetch(`${apiURL}/${payload}`);
    }
    fetchData
      .then(response => response.json())
      .then(data => {
        setReports(data.reports);
        // Decode payload from each report
        const decode = data.reports.map((report: Report) => {
          return ethers.utils.toUtf8String(report.payload);
        });
        const reportData = JSON.parse(decode)

        setDecodedReports(reportData)
        //console.log(parseEther("1000000000000000000", "gwei"))
      });
  };

  useEffect(() => {
    inspectCall(`balance/${wallet?.accounts[0]?.address}`)
  }, [])

  function copyToClipboard() {
    if (!wallet) {
      return;
    }
    navigator.clipboard.writeText(wallet?.accounts[0]?.address).then(function () {
      toast.success("Wallet address copied successfully");
    }).catch(function (err) {
      console.error('Could not copy text: ', err);
    });
  }

  return (
    <Box borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <div className=" bg-no-repeat p-4 rounded-[8px] min-w-[305px] h-[200px] flex flex-col items-between justify-between bg-gradient-to-r from-[#5522CC] to-[#ED4690]">
        <div className="flex items-center justify-end gap-2 py-1">
          <span className="text-xl md:text-4xl font-bold text-white ">{shortenAddress(wallet?.accounts[0]?.address)}</span>
          <BsClipboard2Fill onClick={copyToClipboard} className="text-white hover:text-blue-400 cursor-pointer text-2xl" />
        </div>
        {reports?.length === 0 && (
          <span className='sm:text-base grotesk font-bold leading-[25.5px] tracking-[0.085px] mt-4 mb-2 text-xl px-3 text-white'>looks like your BlockTicket3 balance is zero! 🙁</span>
        )}
        {decodedReports && decodedReports.ether && (
          <div className='text-white px-3'>
            <span className='text-base block mb-1.5'>Balance</span>
            <span className="sm:text-2xl grotesk font-bold leading-[25.5px] tracking-[0.085px] mt-4 mb-2 text-2xl">
              {ethers.utils.formatEther(decodedReports.ether)}
            </span>
          </div>
        )}
      </div>
      {/* <TableContainer>
        <Stack>
          <Table variant='striped' size="lg">
            <Thead>
              <Tr>
                <Th textAlign={'center'}>Ether</Th>
                <Th textAlign={'center'}>ERC-20</Th>
                <Th textAlign={'center'}>ERC-721</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reports?.length === 0 && (
                <Tr>
                  <Td colSpan={4} textAlign={'center'} fontSize='14' color='grey' >looks like your BlockTicket3 balance is zero! 🙁</Td>
                </Tr>
              )}

              {<Tr key={`${decodedReports}`}>
                {decodedReports && decodedReports.ether && (
                  <Td textAlign={'center'}>{ethers.utils.formatEther(decodedReports.ether)}</Td>)}
                {decodedReports && decodedReports.erc721 && (
                  <Td textAlign={'center'}>
                    <div>📍 {String(decodedReports.erc721).split(",")[0]}</div>
                    <div>🆔 {String(decodedReports.erc721).split(",")[1]}</div>
                  </Td>)}
              </Tr>}
            </Tbody>
          </Table>
          <Button onClick={() => inspectCall(`balance/${wallet?.accounts[0]?.address}`)}>Get Balance</Button>
        </Stack>
      </TableContainer> */}
    </Box>
  );
};