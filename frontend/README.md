<div align="center">
    <h1>Cartesi Frontend Web Lite</h1>
    <i>An simple version of a web frontend to interact with Cartesi dApps</i>
</div>
<div align="center">
  This repository contains an boiler plate for a Web Frontend to Interact with Cartesi dApps.
</div>

<div align="center">
  
  <a href="">[![Static Badge](https://img.shields.io/badge/cartesi--rollups-1.0.0-5bd1d7)](https://docs.cartesi.io/cartesi-rollups/)</a>
  <a href="">[![Static Badge](https://img.shields.io/badge/sunodo-0.9.5-blue
)</a>
  <a href="">[![Static Badge](https://img.shields.io/badge/react-18.1.0-red)](https://react.dev/)</a>
</div>

## Features

With this project you can test some interactions with the Cartesi Rollups project:

1. Metamask integration
2. Sending Dapp Address with the DApp Relay
3. Sending inputs
4. Listing Notices
5. Listing Reports
6. Listing Vouchers
7. Executing Vouchers

## Configuration

Edit src/config.json to set the testnet parameters and deployment, inspect, graphql, rpc addresses.

### Metamask

You will need one to import one of our test wallets imported to the metamask to send inputs to the local blockchain where the dApps is running. Remeber to get one of the private keys in the start of the log of the backend. To see a private key, run the backend with a verbose flag enabled:

```
sunodo run --verbose
```

where at the start of the log you will see one of those private keys. Add one of them to the metamask.

## Building the frontend

In the project directory, run:

```shell
yarn
yarn codegen
```

to build the app.

```shell
yarn start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Voucher Notes

Remeber to execute the backend application with a low epoch duration to test the execution of the vouchers. To do that, in the [backend](../backend) folder , execute:

```
sunodo run --epoch-duration 30

```

where 30 is the time in seconds of an epoch.

