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
  const [messages, setMessages] = useState<PostedMessage[]>([]); // Assuming messages are strings

  useEffect(() => {
    postFeed.getMessages().then(setMessages);
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { fieldset, message, topic, donation } = e.currentTarget
      .elements as any;

    fieldset.disabled = true;

    await postFeed.addMessage(message.value, topic.value, donation.value);
    const messages = await postFeed.getMessages();

    setMessages(messages);
    message.value = '';
    topic.value = '';
    donation.value = '0';
    fieldset.disabled = false;
    message.focus();
  };

  const signIn = (): void => {
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
        </table>

        <hr />
        {isSignedIn ? (
          <Form onSubmit={onSubmit} currentAccountId={accountId} />
        ) : (
          <SignIn />
        )}

        <hr />

        {!!messages.length && <Messages messages={messages} />}
      </main>
    </>
  );
};

export default App;
