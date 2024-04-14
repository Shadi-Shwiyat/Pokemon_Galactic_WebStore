import React, { useState } from 'react';
import '../styles/App.css';
import filter_icon from '../assets/icons/filter.png';

export function Market_filter({ spriteUrl }) {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    console.log(expanded);
  };

  const handleButtonClick = (e) => {
    // Stop event propagation
    e.stopPropagation();
    toggleExpanded();
  };

  return (
    <>
      <button className={`filter-button ${expanded ? '' : 'hide'}`} onClick={handleButtonClick}>
        <img src={filter_icon} alt="filter_button.png" className='filter-icon' />
      </button>
      <div className={`filter-form ${expanded ? '' : 'display'}`} onClick={toggleExpanded}>
        <h1 className='form-header'>This is the form</h1>
      </div>
    </>
  );
}