import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import Form from './components/ui/Form';
import SignIn from './components/ui/SignIn';
import Messages from './components/ui/Messages';
import { Header } from './components/ui/Header';
import './global.scss';

const App = ({ isSignedIn, postFeed, wallet }) => {
  console.log('Before AppWallet');
  console.log(wallet);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    postFeed.getMessages().then(setMessages);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const { fieldset, message, topic, donation } = e.target.elements;

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

  const signIn = () => {
    wallet.signIn();
  };

  const signOut = () => {
    wallet.signOut();
  };
  console.log('After AppWallet');
  console.log(wallet);

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
          <Form onSubmit={onSubmit} currentAccountId={wallet.accountId} />
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
