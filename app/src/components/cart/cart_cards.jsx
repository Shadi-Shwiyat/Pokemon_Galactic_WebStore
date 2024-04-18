import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebase';
import '../../styles/Cart.css';

export default function Cart() {
  const [userData, setUserData] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Check if a user is logged in
    const unsubscribe = getAuth(app).onAuthStateChanged(user => {
      if (user) {
        // User is signed in, fetch user data
        fetchUserData(user.uid);
        
        // Retrieve cart items from local storage
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        if (storedCart) {
          setCartItems(storedCart);
        }
      } else {
        // No user is signed in
        console.log('No user is signed in');
      }
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from auth state changes
  }, []);

  // Function to fetch user data based on user ID
  const fetchUserData = (userId) => {
    // Fetch user data with a GET request, providing the userId parameter
    fetch(`https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getUserData?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      setUserData(data);
    })
    .catch(err => {
      console.error('Error fetching user data:', err);
      alert('Failed to load user data. Please refresh the page.');
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Function to handle the checkout process
  const handleCheckout = () => {
    if (!userData || cartItems.length === 0) {
        alert('User data is not loaded yet or cart is empty.');
        return;
    }

    // You might want to handle this asynchronously or in a more structured way to handle multiple items
    cartItems.forEach(item => {
        fetch('https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/purchasePokemon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userData.id,
                pokemonId: item.id
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Checkout successful!');
                // Assuming you want to clear all items after a successful checkout
                localStorage.removeItem('cart');
                setCartItems([]);

                // Update user data with the returned data from the server
                setUserData(prevUserData => ({
                    ...prevUserData,
                    pokeDollars: data.userData.pokeDollars
                }));
            } else {
                alert(data.errorMessage);
            }
        })
        .catch(err => {
            console.error('Error during checkout:', err);
            alert('Failed to process checkout. Please try again.');
        });
    });
};

  return (
    <div className="cart-container">
      {userData && (
        <header className="cart-header">
          <h1 className='cart-header'>Welcome, {userData.username}</h1>
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
