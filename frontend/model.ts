import { NetworkId } from '@near-wallet-selector/core';

export interface PostedMessage {
  premium?: boolean;
  sender: string;
  time: string;
  donation?: string;
  text: string;
  topic?: string;
}

export interface newMessage {
  text: string;
  topic: string;
  donation: string;
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
