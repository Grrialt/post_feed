import 'regenerator-runtime/runtime';
import React, { useState, useEffect, FormEvent } from 'react';
import Form from './components/ui/Form';
import SignIn from './components/ui/SignIn';
import Messages from './components/ui/Messages';

import { Wallet } from './near-wallet';
import { PostFeed } from './near-interface';
import './global.scss';
import { PostedMessage } from './model';

interface Props {
  isSignedIn: boolean;
  postFeed: PostFeed;
  wallet: Wallet;
}

const App: React.FC<Props> = ({ isSignedIn, postFeed, wallet }) => {
  const [messages, setMessages] = useState<PostedMessage[]>([]);
  const [messagesCount, setMessagesCount] = useState<number>(0);
  const [topicValue, setTopicValue] = useState('');

  useEffect(() => {
    postFeed.getMessages().then(setMessages);
    postFeed.getMessagesCount().then(setMessagesCount);
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { fieldset, message, topic, donation } = e.currentTarget
      .elements as any;

    fieldset.disabled = true;

    await postFeed.addMessage(message.value, topic.value, donation.value);
    const messages = await postFeed.getMessages();

    setMessages(messages);
    postFeed.getMessagesCount().then(setMessagesCount);

    message.value = '';
    topic.value = '';
    setTopicValue('');
    donation.value = '0';
    fieldset.disabled = false;
    message.focus();
  };

  const signIn = (): void => {
    console.log(process.env.CONTRACT_NAME)
    wallet.signIn();
  };

  const signOut = (): void => {
    wallet.signOut();
  };

  const accountId = wallet.accountId ?? 'No account id';

  return (
    <>
      <main>
        <table>
          <tbody>
            <tr>
              <td>
                <h1>Decentralize Your Posts</h1>
              </td>
              <td>
                {isSignedIn ? (
                  <button onClick={signOut}>Log out</button>
                ) : (
                  <button onClick={signIn}>Log in</button>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <hr />
        {isSignedIn ? (
          <Form
            onSubmit={onSubmit}
            currentAccountId={accountId}
            topicValue={topicValue}
            setTopicValue={setTopicValue}
          />
        ) : (
          <SignIn />
        )}

        <hr />

        {!!messages.length && (
          <Messages messages={messages} messagesCount={messagesCount} />
        )}
      </main>
    </>
  );
};

export default App;
