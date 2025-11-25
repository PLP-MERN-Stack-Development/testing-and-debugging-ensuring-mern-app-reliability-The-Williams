// client/src/components/BugForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

const BugForm = () => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await axios.post('/api/bugs', { title });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Bug title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add Bug</button>
    </form>
  );
};

export default BugForm;
