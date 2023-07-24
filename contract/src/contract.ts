import { NearBindgen, near, call, view, Vector } from 'near-sdk-js';
import { POINT_ONE, PostedMessage } from './model';

@NearBindgen({})
class PostFeed {
  messages: Vector<PostedMessage> = new Vector<PostedMessage>('v-uid');

  @call({ payableFunction: true })
  // Public - Adds a new message.
  add_message({
    text,
    topic,
    donation,
  }: {
    text: string;
    topic: string;
    donation: string;
  }) {
    // If the user attaches more than 0.1N the message is premium
    const premium = near.attachedDeposit() >= BigInt(POINT_ONE);
    const sender = near.predecessorAccountId();
    const time = near.blockTimestamp();

    const message: PostedMessage = {
      premium,
      sender,
      time,
      text,
      topic,
      donation,
    };
    this.messages.push(message);
  }

  @view({})
  // Returns an array of messages.
  get_messages({
    from_index = 0,
    limit = 100,
  }: {
    from_index: number;
    limit: number;
  }): PostedMessage[] {
    return this.messages.toArray().slice(from_index, from_index + limit);
  }

  @view({})
  total_messages(): number {
    return this.messages.length;
  }
}
