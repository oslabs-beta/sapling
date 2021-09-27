import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

// React element allowing users to create a new exercise via form
const ExerciseCreator = () => {
  const [redirect, setRedirect] = useState(false);
  const [formVals, setFormVals] = useState({
    name: '',
    description: '',
    type_id: '1',
    init_weight: '',
    init_reps: '',
    init_sets: '',
    init_rest: '',
  });

  // Helper function to update state formVals on form change
  const updateFormVal = (key, val) => {
    setFormVals({ ...formVals, [key]: val });
  };

  // Function to submit new exercise form data to server for processing
  const createExercise = () => {
    console.log('Trying to create exercise: ', formVals);
    fetch('/api/exercise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formVals),
    })
      .then((response) => {
        // If creation successful, redirect to exercises
        console.log('CREATE RESPONSE: ', response.status);
        if (response.status === 200) {
          return response.json();
        }
        throw new Error('Error when trying to login a user!');
      }).then((data) => {
        console.log('Added new exercise: ', data);
        setRedirect(true);
      })
      .catch((err) => console.error(err));
  };

  const {
    name, description, type, init_weight, init_reps, init_sets, init_rest,
  } = formVals;

  // If successfully created new exercise, redirect to '/' route:
  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <section>
      <h3>Create a new Exercise:</h3>

      {/* NEW EXERCISE FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createExercise();
        }}
      >

        {/* EXERCISE NAME INPUT */}
        <label htmlFor="exerciseName">Exercise Name:</label>
        <input
          id="exerciseName"
          type="text"
          placeholder="Exercise Name"
          onChange={(e) => {
            console.log('Updated createEx formVals: ', e.target.value);
            updateFormVal('name', e.target.value);
          }}
          value={name}
          name="name"
          required
        />
        <br />

        {/* EXERCISE TYPE INPUT */}
        <label htmlFor="exerciseType">Exercise Type:</label>
        <select
          id="exerciseType"
          onChange={(e) => {
            console.log('Updated createEx formVals: ', e.target.value);
            updateFormVal('type_id', e.target.value);
          }}
          // options={[
          //   { label: 'Arms', value: 1 },
          //   { label: 'Legs', value: 2 },
          //   { label: 'Core', value: 3 },
          //   { label: 'Upper Body', value: 4 },
          //   { label: 'Lower Body', value: 5 },
          //   { label: 'Back', value: 6 },
          // ]}
          // defaultValue={{ label: 'Arms', value: 1 }}
          name="exerciseType"
          required
        >
          <option value="1" selected>Arms</option>
          <option value="2">Legs</option>
          <option value="3">Core</option>
          <option value="4">Upper Body</option>
          <option value="5">Lower Body</option>
          <option value="6">Back</option>
        </select>
        <br />

        {/* EXERCISE DESCRIPTION INPUT */}
        <label htmlFor="exerciseDescription">Exercise Description:</label>
        <textarea
          id="exerciseDescription"
          placeholder="Describe the exercise (position, equipment, movements...)"
          onChange={(e) => {
            console.log('Updated createEx formVals: ', e.target.value);
            updateFormVal('description', e.target.value);
          }}
          value={description}
          name="description"
          required
        />
        <br />

        {/* EXERCISE WEIGHT INPUT */}
        <label htmlFor="exerciseWeight">Starting Weight (LBs):</label>
        <input
          id="exerciseWeight"
          type="number"
          onChange={(e) => {
            console.log('Updated createEx formVals: ', e.target.value);
            updateFormVal('init_weight', e.target.value);
          }}
          value={init_weight}
          name="weight"
          min={1}
        />
        <br />

        {/* EXERCISE SETS INPUT */}
        <label htmlFor="exerciseSets">Starting Sets:</label>
        <input
          id="exerciseSets"
          type="number"
          onChange={(e) => {
            console.log('Updated createEx formVals: ', e.target.value);
            updateFormVal('init_sets', e.target.value);
          }}
          value={init_sets}
          name="sets"
          min={1}
        />
        <br />

        {/* EXERCISE REPS INPUT */}
        <label htmlFor="exerciseReps">Starting Reps:</label>
        <input
          id="exerciseReps"
          type="number"
          onChange={(e) => {
            console.log('Updated createEx formVals: ', e.target.value);
            updateFormVal('init_reps', e.target.value);
          }}
          value={init_reps}
          name="reps"
          min={1}
        />
        <br />

        {/* EXERCISE REST INPUT */}
        <label htmlFor="exerciseReps">Starting Rest Time:</label>
        <input
          id="exerciseRest"
          type="number"
          onChange={(e) => {
            console.log('Updated createEx formVals: ', e.target.value);
            updateFormVal('init_rest', e.target.value);
          }}
          value={init_rest}
          name="rest"
          min={1}
        />
        <br />

        {/* FORM SUBMIT BUTTON */}
        <button
          type="submit"
        >
          Create Exercise
        </button>

        {/* FORM CANCEL BUTTON */}
        <Link to="/">
          <button
          type="button"
          >
            Cancel
          </button>
        </Link>

      </form>
    </section>
  );
};

export default ExerciseCreator;
