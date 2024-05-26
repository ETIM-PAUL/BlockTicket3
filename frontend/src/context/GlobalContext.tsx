import { Action } from "@web3-onboard/core/dist/types";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { ethers } from "ethers";
import React, { Dispatch, ReactNode, useEffect, useReducer } from "react";
import configFile from "../config.json";

interface Props {
    events: Array<any>;
    loading: boolean;
    fetching: boolean;
    balance: string;
}

interface GlobalProviderProps {
    children: ReactNode;
}

const initialState: Props = {
    events: [],
    loading: true,
    fetching: false,
    balance: ""
};

export const GlobalContext = React.createContext<{
    state: Props;
    dispatch: Dispatch<Action>;
}>({
    state: initialState,
    dispatch: () => null,
});

const reducer = (state: Props, action: any) => {
    switch (action.type) {
        case "APPEND_EVENTS":
            return {
                ...state,
                events: [...state.events, action.payload],
            };
        case "SET_EVENTS":
            return {
                ...state,
                events: action.payload,
            };
        case "UPDATE_EVENT_STATUS":
            return {
                ...state,
                events: state.events.map(event =>
                    event.id === action.payload.id ? { ...event, status: action.payload.status } : event
                )
            };
        case "SET_BALANCE":
            return {
                ...state,
                balance: action.payload,
            };
        case "SET_LOADING":
            return {
                ...state,
                loading: action.payload,
            };
        case "SET_FETCHING":
            return {
                ...state,
                fetching: action.payload,
            };

        default:
            return state;
    }
};

/**
 * @param {"success"| "error" | "warning"} toastStatus
 * @param {any} dispatch
 * @param {string} message
 * @param {number} timeout
 */

const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [{ connectedChain }] = useSetChain();
    const [{ wallet }] = useConnectWallet();

    const config: any = configFile;

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

    const fetchEvents = async (str: string) => {
        try {
            dispatch({
                type: "SET_LOADING",
                payload: true,
            });
            let payload = str;
            if (!connectedChain) {
                return;
            }
            let apiURL = "";

            if (config[connectedChain.id]?.inspectAPIURL) {
                try {
                    apiURL = `${config[connectedChain.id].inspectAPIURL}/inspect`;
                } catch (error) {
                    dispatch({
                        type: "SET_LOADING",
                        payload: false,
                    });
                }
            } else {
                console.error(
                    `No inspect interface defined for chain ${connectedChain.id}`
                );
                dispatch({
                    type: "SET_LOADING",
                    payload: false,
                });
                return;
            }

            let fetchData: Promise<Response>;
            fetchData = fetch(`${apiURL}/${payload}`);
            fetchData
                .then((response) => response.json())
                .then((data) => {
                    // Decode payload from each report
                    const decode = data.reports.map((report: { payload: string }) => {
                        return ethers.utils.toUtf8String(report.payload);
                    });
                    const reportData = JSON.parse(decode);
                    state.events = reportData
                    dispatch({
                        type: "SET_EVENTS",
                        payload: reportData,
                    });
                    dispatch({
                        type: "SET_LOADING",
                        payload: false,
                    });
                });
        } catch (error) {
            dispatch({
                type: "SET_LOADING",
                payload: false,
            });
            console.log(error);
            state.events = []

        }
    };

    useEffect(() => {
        if (wallet?.accounts[0]?.address) {
            fetchEvents("get_all/").then((res) =>
                getBalance(`balance/${wallet?.accounts[0]?.address}`)
            );
        }
    }, [state.fetching])


    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
