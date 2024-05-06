// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React from "react";
import App from "./App";
import configFile from "./config.json";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Web3OnboardProvider, init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AllEventsPage from "./pages/AllEventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import CreateEventPage from "./pages/CreateEventPage";
import UserDashboardPage from "./pages/UserDashboardPage";
const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

const config = configFile;

const injected = injectedModule();
const web3Onboard = init({
    wallets: [injected],
    chains: Object.entries(config).map(([k, v], i) => ({
        id: k,
        token: v.token,
        label: v.label,
        rpcUrl: v.rpcUrl,
    })),
    appMetadata: {
        name: "BlockTicket3",
        icon: "<svg><svg/>",
        description: "BlockTicket3An Event Ticket and DAO Application",
        recommendedInjectedWallets: [
            { name: "MetaMask", url: "https://metamask.io" },
        ],
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },

    {
        path: "/events",
        element: <AllEventsPage />,
    },

    {
        path: "/event-details/:id",
        element: <EventDetailsPage />,
    },

    {
        path: "/create-event",
        element: <CreateEventPage />,
    },

    {
        path: "/user-dashboard",
        element: <UserDashboardPage />,
    },
]);
root.render(
    <React.StrictMode>
        <Web3OnboardProvider web3Onboard={web3Onboard}>
            <RouterProvider router={router} />
            <ToastContainer />
        </Web3OnboardProvider>
    </React.StrictMode>
);

reportWebVitals();
