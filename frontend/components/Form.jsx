import React from 'react';
import PropTypes from 'prop-types';
import TopicDropdown from './ui/TopicDropdown';

export default function Form({ onSubmit, currentAccountId }) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
        <p>Share your thought with the network, {currentAccountId}!</p>
        <p className="highlight">
          <div className="messageInput">
            <input
              style={{ color: 'white' }}
              autoComplete="off"
              autoFocus
              id="message"
              required
              placeholder={'Message'}
            />
          </div>
          <div className="topic">
            <TopicDropdown />
          </div>
        </p>
        <p>
          <label style={{ color: 'white' }} htmlFor="donation">
            Donation (optional):
          </label>
          <input
            autoComplete="off"
            defaultValue={'0'}
            id="donation"
            min="0"
            step="0.01"
            type="number"
          />
          <span title="NEAR Tokens">Ⓝ</span>
        </p>
        <button type="submit">Send</button>
      </fieldset>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  }),
};
