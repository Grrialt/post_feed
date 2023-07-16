import { utils } from 'near-api-js';

interface PostFeedConfig {
  contractId: string;
  walletToUse: any; // You should replace Wallet type with actual Wallet type used in your project
}

class PostFeed {
  contractId: string;
  wallet: any; // You should replace any type with actual Wallet type used in your project

  constructor({ contractId, walletToUse }: PostFeedConfig) {
    this.contractId = contractId;
    this.wallet = walletToUse;
  }

  async getMessages(): Promise<any> {
    // Replace any with the type of messages
    const messages = await this.wallet.viewMethod({
      contractId: this.contractId,
      method: 'get_messages',
    });
    console.log(messages);
    return messages;
  }

  async addMessage(
    message: string,
    topic: string,
    donation: string,
  ): Promise<any> {
    // Replace any with the type of return value
    const deposit = utils.format.parseNearAmount(donation) || '0';
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'add_message',
      args: { text: message, topic: topic, donation: donation },
      deposit,
    });
  }
}

export { PostFeed };
