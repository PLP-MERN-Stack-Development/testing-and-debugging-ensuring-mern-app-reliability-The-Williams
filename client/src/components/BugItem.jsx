// client/src/components/BugItem.jsx

import React from 'react';

const BugItem = ({ bug }) => {
  return (
    <div style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
      <strong>{bug.title}</strong>
      <p>Status: {bug.status || "open"}</p>
    </div>
  );
};

export default BugItem;
