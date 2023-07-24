import { NetworkId } from '@near-wallet-selector/core';

export interface PostedMessage {
  sender: string;
  text: string;
  time: string;
  topic?: string;

  premium?: boolean;
  donation?: string;
}

export interface viewMethodResponse {
  block_hash: string;
  block_height: number;
  logs: any[];
  result: number[];
}

export interface WalletConfig {
  createAccessKeyFor?: string;
  network?: NetworkId;
}

export interface MethodOptions {
  contractId: string;
  method: string;
  args?: object;
  gas?: string;
  deposit?: string | null;
}
