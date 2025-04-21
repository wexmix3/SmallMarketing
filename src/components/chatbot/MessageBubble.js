/**
 * Message Bubble Component
 * Component for rendering chat messages
 */

import React from 'react';

/**
 * Message Bubble Component
 * @param {Object} props - Component props
 * @param {Object} props.message - Message data
 * @param {Function} props.formatTime - Time formatting function
 * @returns {JSX.Element} - Message bubble component
 */
export const MessageBubble = ({ message, formatTime }) => {
  return (
    <div className={`message ${message.type}`}>
      <div className="message-content">
        {message.content}
      </div>
      <div className="message-time">
        {formatTime(message.timestamp)}
        {message.type === 'assistant' && ' • AI'}
      </div>
    </div>
  );
};
