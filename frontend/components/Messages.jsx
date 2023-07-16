import React from 'react';
import PropTypes from 'prop-types';
import './ui/Messages.scss';
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
  const stringsArray = topics.split(' ');
  console.log(stringsArray);
  return stringsArray
    .filter((word) => word.trim() !== '')
    .map((word, index) => (
      <span key={index}>
        <a className="link" href={word.startsWith('#') ? word : '#' + word}>
          {word.startsWith('#') ? word : '#' + word}
        </a>{' '}
      </span>
    ));
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
            >
              <div className="message-header">
                <div>
                  <strong className="sender-name">
                    {message.sender + ' '}
                  </strong>
                  <small className="message-time">{timeAgo(date)}</small>
                </div>
                <strong className="donation">
                  {message.donation && message.donation !== '0'
                    ? 'Ⓝ' + message.donation
                    : ''}
                </strong>
              </div>
              <div className="message-text">{message.text}</div>
              <span className="message-topic">
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
