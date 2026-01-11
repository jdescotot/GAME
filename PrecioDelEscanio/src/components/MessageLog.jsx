import React from 'react';

export function MessageLog({ messages }) {
  return (
    <div className="message-log">
      {messages.length === 0 && (
        <p
          style={{
            textAlign: 'center',
            fontStyle: 'italic',
            color: '#475569',
            fontSize: '0.875rem',
          }}
        >
          Esperando acciones...
        </p>
      )}

      {messages.map(msg => (
        <div
          key={msg.id}
          className={`msg-item ${msg.color}`}
        >
          • {msg.text}
        </div>
      ))}
    </div>
  );
}
