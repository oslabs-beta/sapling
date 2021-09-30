import React, { useState, useEffect } from 'react';

const HistoryDisplay = () => {
  const [history, setHistory] = useState([]);

  const getHistory = () => {
    fetch('/api/history')
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        throw new Error ('Error getting history from server.');
      })
      .then((data) => {
        console.log('Our getHistory data is:', data);
        setHistory(data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    console.log('GETTING HISTROY FROM SERVER');
    getHistory();
  }, []);

  const drills = history.map((drill, i) => {
    return <li key={drill._id}> Date: {drill.date}, id: {drill.exercise_id}, Weight: {drill.weight}, Sets: {drill.sets}, Reps: {drill.reps}, Rest: {drill.rest_interval} </li> 
  });

  return(
    <div>
      <h1>Drill History:</h1>
      <ul>
        {drills}
      </ul>
    </div>
  );
};

export default HistoryDisplay;
