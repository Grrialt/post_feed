import React from 'react';
import PropTypes from 'prop-types';
import { create } from 'domain';


function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (isNaN(interval)) return 'a long time ago';
  if (interval > 1) return interval + ' years ago';

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + ' months ago';

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + ' days ago';

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + ' hours ago';

  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + ' minutes ago';

  return Math.floor(seconds) + ' seconds ago';
}

function createLinks(topics) {
    const stringsArray = topics.split(' ')
    return stringsArray.map((word, index) => <a style={{color: 'var(--primary)'}} key={index} href={word}>{word} {" "}</a>);
}



export default function Messages({ messages }) {
  return (
    <>
      <h2>Messages: {messages.length}</h2>
      {messages.reverse().map((message, i) => {
        // Convert timestamp to date (assuming nanoseconds)
        let date = new Date(parseInt(message.time) / 1000000);

        return (
          <>
            <div
              key={i}
              className={`${message.premium && 'is-premium'} message`}
              style={{
                border: '2px solid var(--secondary)',
                padding: '10px',
                margin: '10px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <div>
                  <strong style={{ color: 'var(--secondary)' }}>
                    {message.sender + ' '}
                  </strong>
                  <small style={{ color: 'var(--placeholder-white)' }}>
                    {timeAgo(date)}
                  </small>
                </div>
                <strong style={{ alignSelf: 'flex-start' }}>
                  {message.donation && message.donation !== '0'
                    ? 'Ⓝ' + message.donation
                    : ''}
                </strong>
              </div>
              {message.text}
              <span style={{ color: 'var(--tertiary)' }}>
                <small>{message.topic && createLinks(message.topic)}</small>
              </span>
            </div>
          </>
        );
      })}
    </>
  );
}

Messages.propTypes = {
  messages: PropTypes.array,
};
