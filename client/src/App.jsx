// client/src/App.jsx

import React from 'react';
import BugForm from './components/BugForm';
import BugList from './components/BugList';

const App = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Bug Tracker</h1>
      <BugForm />
      <BugList />
    </div>
  );
};

export default App;
