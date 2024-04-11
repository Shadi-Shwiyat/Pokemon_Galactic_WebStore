import React, { useEffect, useState } from 'react';
import './styles/App.css';
import logo from './assets/logo_test.png'
import g from './assets/g.png'
import { Pokemon } from './components/pokemon_page.jsx'
import { Login } from './components/login.jsx'

function App() {

  const isLoggedIn = true;

  let content;
  if (isLoggedIn) {
    content = <Pokemon />;
  } else {
    content = <Login />;
  }

  return (
    <>
      <img src={logo} alt="logo.png" className='logo' />
      <div className='content'>
        {content}
      </div>
      <img src={g} alt="g.png" className='g' />
    </>
  );
}

export default App;
