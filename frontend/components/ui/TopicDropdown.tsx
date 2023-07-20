import React, { useState, useEffect } from 'react';
import './TopicDropdown.scss';

// Generate a list of 10 random tags
const generateTags = () => {
  let tags = [];
  for (let i = 0; i < 10; i++) {
    tags.push(`#${Math.random().toString(36).substring(2, 7)}`);
  }
  return tags;
};

interface Props {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const TopicDropdown: React.FC<Props> = ({ value, setValue }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  // Update the tag list whenever showDropdown changes
  useEffect(() => {
    if (showDropdown) {
      setTags(generateTags());
    } else {
      setTags([]);
    }
  }, [showDropdown]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Only update input if all words start with '#' or if it's empty
    const allWordsStartWithHash = inputValue
      .split(' ')
      .every((word) => word.startsWith('#') || word === '');

    if (allWordsStartWithHash) {
      setValue(inputValue);

      // Show the dropdown if the input ends with #
      if (inputValue.endsWith('#')) {
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }
  };

  const handleTagClick = (tag: string) => {
    // Append the clicked tag to the input (replace '#' with the tag//)
    setValue((prevInput) => prevInput.slice(0, prevInput.length - 1) + tag);
    setShowDropdown(false);
  };

  return (
    <>
      <input
        id="topic"
        type="text"
        value={value}
        onChange={handleInputChange}
        className="inputField"
        autoComplete="off"
        placeholder="#topic"
      />
      {showDropdown && (
        <div className="dropdownContainer">
          {tags.map((tag, index) => (
            <div
              key={index}
              onClick={() => handleTagClick(tag)}
              className="dropdownItem"
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TopicDropdown;
