import React, { useState } from 'react';
import { Pokemon } from './pokemon_page.jsx';
import { Items } from './items.jsx';
import { About } from './about.jsx';
import { Cart } from './cart.jsx';

export function Header() {
  const [currentPage, setCurrentPage] = useState('pokemon');

  const renderPage = () => {
    switch (currentPage) {
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
        <nav>
          <ul className='nav-links'>
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
