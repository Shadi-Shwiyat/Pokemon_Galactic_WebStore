import React, { useEffect, useState } from 'react';
import './styles/App.css';
import g from './assets/g.png'
import { Header } from './components/header.jsx'
import { Login } from './components/login.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize isLoggedIn state
  let content;

  useEffect(() => {
    // Check if user is already logged in and session is valid
    const loggedIn = localStorage.getItem('isLoggedIn');
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (loggedIn && loginTimestamp) {
        const currentTime = new Date().getTime();
        const elapsed = currentTime - parseInt(loginTimestamp, 10);
        const elapsedHours = elapsed / (1000 * 60 * 60);
        if (elapsedHours < 1) {
            // Session is still valid
            setIsLoggedIn(true);
        } else {
            // Session has expired, log out the user
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loginTimestamp');
        }
    }
  }, []);
  
  if (isLoggedIn) {
    content = <Header />;
  } else {
    content = <Login setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <>
      {content}
      <img src={g} alt="g.png" className='g' />
    </>
  );
}

export default App;
