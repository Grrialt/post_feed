import { providers } from 'near-api-js';
import '@near-wallet-selector/modal-ui/styles.css';
import { setupModal } from '@near-wallet-selector/modal-ui';
// @ts-ignore
import LedgerIconUrl from '@near-wallet-selector/ledger/assets/ledger-icon.png';
// @ts-ignore
import MyNearIconUrl from '@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png';
import { NetworkId, setupWalletSelector } from '@near-wallet-selector/core';
import { setupLedger } from '@near-wallet-selector/ledger';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

import {
  PostedMessage,
  WalletConfig,
  MethodOptions,
  viewMethodResponse,
} from './model';
import type { WalletSelector } from '@near-wallet-selector/core';

const THIRTY_TGAS = '30000000000000';
const NO_DEPOSIT = '0';

export class Wallet {
  walletSelector!: WalletSelector; // Replace with actual WalletSelector type
  wallet: any; // Replace with actual Wallet type
  network: NetworkId;
  createAccessKeyFor: string | undefined | null;
  accountId: string | undefined | null;

  constructor({
    createAccessKeyFor = undefined,
    network = 'testnet',
  }: WalletConfig) {
    this.createAccessKeyFor = createAccessKeyFor;
    this.network = network;
  }

  async startUp(): Promise<boolean> {
    this.walletSelector = await setupWalletSelector({
      network: this.network,
      modules: [
        setupMyNearWallet({ iconUrl: MyNearIconUrl }),
        setupLedger({ iconUrl: LedgerIconUrl }),
      ],
    });

    const isSignedIn = this.walletSelector.isSignedIn();

    if (isSignedIn) {
      this.wallet = await this.walletSelector.wallet();
      this.accountId =
        this.walletSelector.store.getState().accounts[0].accountId;
    }

    return isSignedIn;
  }

  signIn(): void {
    const description = 'Please select a wallet to sign in.';
    // Check if this.createAccessKeyFor is defined and not null
    if (this.createAccessKeyFor == null) {
      // It's undefined or null, throw an error
      throw new Error('createAccessKeyFor is not defined.');
    }
    const modal = setupModal(this.walletSelector, {
      contractId: this.createAccessKeyFor,
      description,
    });
    modal.show();
  }

  signOut(): void {
    this.wallet.signOut();
    this.wallet = this.accountId = this.createAccessKeyFor = null;
    window.location.replace(window.location.origin + window.location.pathname);
  }

  private getProvider(): providers.JsonRpcProvider {
    const { network } = this.walletSelector.options;
    return new providers.JsonRpcProvider({ url: network.nodeUrl });
  }

  async viewMethod({
    contractId,
    method,
    args = {},
  }: MethodOptions): Promise<PostedMessage[]> {
    const provider = this.getProvider();

    let res = await provider.query({
      request_type: 'call_function',
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
      finality: 'optimistic',
    });

    return JSON.parse(
      Buffer.from((res as viewMethodResponse).result).toString(),
    );
  }

  async viewCountMethod({
    contractId,
    method,
    args = {},
  }: MethodOptions): Promise<number> {
    const provider = this.getProvider();

    let res = await provider.query({
      request_type: 'call_function',
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
      finality: 'optimistic',
    });

    return JSON.parse(
      Buffer.from((res as viewMethodResponse).result).toString(),
    );
  }

  async callMethod({
    contractId,
    method,
    args = {},
    gas = THIRTY_TGAS,
    deposit = NO_DEPOSIT,
  }: MethodOptions): Promise<any> {
    const outcome = await this.wallet.signAndSendTransaction({
      signerId: this.accountId!,
      receiverId: contractId,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    });

    return providers.getTransactionLastResult(outcome);
  }

  async getTransactionResult(txhash: string): Promise<any> {
    const { network } = this.walletSelector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    const transaction = await provider.txStatus(txhash, 'unnused');
    return providers.getTransactionLastResult(transaction);
  }
}
