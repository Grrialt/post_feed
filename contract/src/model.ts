export const POINT_ONE = '100000000000000000000000';

export class PostedMessage {
  premium: boolean;
  sender: string;
  time: bigint;
  text: string;
  topic: string;
  donation: string;

  constructor({ premium, sender, text, topic, donation }: PostedMessage) {
    this.premium = premium;
    this.sender = sender;
    this.text = text;
    this.topic = topic;
    this.donation = donation;
  }
}