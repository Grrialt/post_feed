import React from 'react';
import TopicDropdown from './TopicDropdown';
import './Form.scss';

interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  currentAccountId: string;
  topicValue: string;
  setTopicValue: React.Dispatch<React.SetStateAction<string>>;
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  currentAccountId,
  topicValue,
  setTopicValue,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
        <p>Share your thought with the network, {currentAccountId}!</p>
        <p className="highlight">
          <div className="messageInput">
            <input
              autoComplete="off"
              autoFocus
              id="message"
              required
              placeholder={'Message'}
            />
          </div>
          <div className="topic">
            <TopicDropdown value={topicValue} setValue={setTopicValue} />
          </div>
        </p>
        <p>
          <label htmlFor="donation">Donation (optional):</label>
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
};

export default Form;
