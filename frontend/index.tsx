// React
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// NEAR
import { PostFeed } from './near-interface';
import { Wallet } from './near-wallet';

// When creating the wallet dev can choose to create an access key, so the user
// can skip signing non-payable methods when talking with the smart contract
const wallet = new Wallet({
  createAccessKeyFor: process.env.CONTRACT_NAME as string,
});

// Abstract the logic of interacting with the contract to simplify your flow
const postFeed = new PostFeed({
  contractId: process.env.CONTRACT_NAME as string,
  walletToUse: wallet,
});

// Setup on page load
window.onload = async (): Promise<void> => {
  const isSignedIn = await wallet.startUp();

  ReactDOM.render(
    <App isSignedIn={isSignedIn} postFeed={postFeed} wallet={wallet} />,
    document.getElementById('root') as HTMLElement,
  );
};
