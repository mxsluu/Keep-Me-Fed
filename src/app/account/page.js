'use client';

import { useState } from 'react'; // Import useState hook
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  // State to store the budget value
  const [budget, setBudget] = useState('');
  // State to track if the button is clicked
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  // Event handler for budget input change
  const BudgetChanged = (event) => {
    setBudget(event.target.value);
  };

  // Event handler for adding budget
  const addBudget = () => {
    // Update isButtonClicked to true when the button is clicked
    setIsButtonClicked(true);
  };

  return (
    <>
      <h1>Account Page</h1>
      <p>
        Enter a budget below. This will reset each week and adjust after each meal 
      </p>
      <div>
        {/* Display label and input field for entering budget */}
        <label>Budget:</label>
        <input type="text" value={budget} onChange={BudgetChanged}/>
        {/* Button to trigger adding budget */}
        <button onClick={addBudget}>Enter</button>
      </div>
      {/* Display the entered budget on the screen only if the button is clicked */}
      {isButtonClicked && <p>Budget entered: ${budget}</p>}
      <ul>
      </ul>
    </>
  );
}
