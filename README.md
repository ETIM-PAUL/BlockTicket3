###### Welcome to Cartesi Wallet template

This template consist of both frontend and backend code, it bootstraps a simple wallet functionality for handling both erc20 and ethers transactions.

Please follow the steps below to set up properly

You will start with the backend setup locally and run it in a no-backend environment

1. CD into the backend - "cd /backend"
2. Install the dependencies - "npm install"
3. Start your backend docker container - "npm run backend"
4. Start your backend - "npm run start"

With your backend docker running and the project backend running locally. You can start the frontend

1. CD into the frontend directory - "cd /frontend"
2. don't worry, the dependencies were install when you bootstrap the project
3. run "npm run start" to start the frontend

To fully test, make sure, you are connected to your metamask wallet and to the local chain. (RPC-  http://127.0.0.1:8545/, chain-id - 31337)