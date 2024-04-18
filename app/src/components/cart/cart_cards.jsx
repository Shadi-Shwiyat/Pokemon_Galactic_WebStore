import React, { useEffect, useState } from 'react';
import '../../styles/App.css';

export default function Cart() {
  const [userData, setUserData] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Assume another endpoint to fetch user data if not related to purchasing
    fetch("https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getUserData")
      .then(res => res.json())
      .then(data => {
        setUserData(data);
      })
      .catch(err => console.error('Error fetching user data:', err));

    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  function removeFromCart(itemId) {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  function handleCheckout() {
    const totalCost = cartItems.reduce((acc, item) => acc + item.marketplace_cost, 0);
    fetch('https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/purchasePokemon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userData.id, // Assuming user data contains user ID
        totalCost: totalCost
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Checkout successful!');
        localStorage.removeItem('cart');
        setCartItems([]);
        setUserData(data.userData); // Update user data with new PokeDollars amount
      } else {
        alert(data.errorMessage);
      }
    })
    .catch(err => {
      console.error('Error during checkout:', err);
      alert('Failed to process checkout. Please try again.');
    });
  }

  return (
    <div className="cart-container">
      {userData && (
        <header className="cart-header">
          <h1>Welcome, {userData.username}</h1>
          <h2>PokeDollars: {userData.pokeDollars.toLocaleString()}</h2>
        </header>
      )}

      <div className="cart-items">
        <h3>Your Cart</h3>
        {cartItems.length > 0 ? (
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="cart-item">
                <img src={item.sprite} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name} (Lv. {item.level})</h4>
                  <p>ID: {item.id}</p>
                  <p>Price: ₽{item.marketplace_cost.toLocaleString()}</p>
                  <p>Moves: {item.moves.join(', ')}</p>
                  <p>Stats: {Object.entries(item.stats).map(([key, value]) => `${key}: ${value}`).join(', ')}</p>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your cart is empty.</p>
        )}
        <button onClick={handleCheckout} disabled={!cartItems.length}>Checkout</button>
      </div>
      {userData && (
        <footer className="cart-footer">
          <p>User: {userData.username}</p>
          <p>PokeDollars Available: {userData.pokeDollars.toLocaleString()}</p>
        </footer>
      )}
    </div>
  );
}
