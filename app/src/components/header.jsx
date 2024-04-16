import React, { useState } from 'react';
import logo from '../assets/logo.png'
import { Market } from './market.jsx';
import { Pokemon } from './pokemon.jsx';
import { Items } from './items.jsx';
import { About } from './about.jsx';
import { Cart } from './cart.jsx';

export function Header() {
  const [currentPage, setCurrentPage] = useState('market');

  const renderPage = () => {
    switch (currentPage) {
      case 'market':
        return <Market />;
      case 'pokemon':
        return <Pokemon />;
      case 'items':
        return <Items />;
      case 'about':
        return <About />;
      case 'cart':
        return <Cart />;
      default:
        return null;
    }
  };

  return (
    <>
      <header>
        <a href="galacticwebstore.com">
          <img src={logo} alt="logo.png" className='logo' />
        </a>
        <nav>
          <ul className='nav-links'>
            <li onClick={() => setCurrentPage('market')}>
              <span className="hover-underline-animation">Market</span>
            </li>
            <li onClick={() => setCurrentPage('pokemon')}>
              <span className="hover-underline-animation">Pokemon</span>
            </li>
            <li onClick={() => setCurrentPage('items')}>
              <span className="hover-underline-animation">Items</span>
            </li>
            <li onClick={() => setCurrentPage('about')}>
              <span className="hover-underline-animation">About</span>
            </li>
            <li onClick={() => setCurrentPage('cart')}>
              <span className="hover-underline-animation">Cart</span>
            </li>
          </ul>
        </nav>
      </header>
      {renderPage()}
    </>
  );
}
