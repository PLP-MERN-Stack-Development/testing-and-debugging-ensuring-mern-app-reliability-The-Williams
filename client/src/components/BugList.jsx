// client/src/components/BugList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BugItem from './BugItem';

const BugList = () => {
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    const fetchBugs = async () => {
      const res = await axios.get('/api/bugs');
      setBugs(res.data);
    };
    fetchBugs();
  }, []);

  return (
    <div>
      <h2>All Bugs</h2>
      {bugs.length === 0 ? (
        <p>No bugs yet.</p>
      ) : (
        bugs.map((bug) => <BugItem key={bug._id} bug={bug} />)
      )}
    </div>
  );
};

export default BugList;
