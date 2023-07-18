/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

import { utils } from 'near-api-js';

export class PostFeed {
  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;
  }

  async getMessages() {
    const messages = await this.wallet.viewMethod({
      contractId: this.contractId,
      method: 'get_messages',
    });
    console.log(messages);
    return messages;
  }

  async addMessage(message, topic, donation) {
    const deposit = utils.format.parseNearAmount(donation);
    const result = await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'add_message',
      args: { text: message, topic: topic, donation: donation },
      deposit,
    });
    console.log('result near-interface.ts');
    console.log(result);
    return result;
  }

  async totalMessages() {
    const messagesNum = await this.wallet.viewMethod({
      contractId: this.contractId,
      method: 'total_messages',
    });
  }
}
