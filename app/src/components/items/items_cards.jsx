import React, { useEffect, useState } from 'react';
import cart_icon from '../../assets/icons/cart.png';
import '../../styles/Items.css';

function ItemCards({ filters }) {
  const [itemData, setItemData] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch item data based on filters or all items
    let url = "https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getAllItems";
    if (filters && filters.total_filters > 0) { // Add a check for filters existence
      // Adjust the URL to include filters if necessary
      // Example: url = `${url}?name=${filters.name}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setItemData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [filters]);

  function formatCost(costString) {
    // Reverse the string to make it easier to insert commas from right to left
    const reversedString = costString.toString().split('').reverse().join('');
    
    // Use a regular expression to insert commas after every three digits
    const formattedString = reversedString.replace(/\d{3}(?=\d)/g, (match) => match + ',');
    
    // Reverse the string back to its original order and return it
    return formattedString.split('').reverse().join('');
 }

  function capitalizeEachWord(str) {
    // Split the string into an array of words separated by hyphen
    const words = str.split('-');
    // Capitalize the first letter of each word
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    // Join the words back into a single string
    return capitalizedWords.join(' ');
  }

  const handleNextPage = () => {
    setPageIndex(prevIndex => prevIndex + 14);
  };

  const handlePreviousPage = () => {
    setPageIndex(prevIndex => Math.max(0, prevIndex - 14));
  };

  return (
    <>
      {loading ? (
        <div className="ring">Loading<span className='ring-span'></span></div>
      ) : (
        <>
          <div className="item-top-card-row">
            {itemData && itemData.slice(pageIndex, pageIndex + 7).map((item, index) => (
              <div className='item-card' key={index}>
                <h3 className='item-card-title'>{`${capitalizeEachWord(item.name)}`}</h3>
                <img className='item-sprite' src={item.sprite} alt={item.name} />
                <p className='item-flavor-text'>{item.flavor_text}</p>
                <div className='item-card-price'>
                  <p className='item-price'>{`₽ ${formatCost(item.cost)}`}</p>
                  <img className="item-cart-icon" src={cart_icon} alt="cart.png" />
                </div>
              </div>
            ))}
          </div>
          <div className="item-bottom-card-row">
            {itemData && itemData.slice(pageIndex + 7, pageIndex + 14).map((item, index) => (
              <div className='item-card' key={index}>
                <h3 className='item-card-title'>{`${capitalizeEachWord(item.name)}`}</h3>
                <img className='item-sprite' src={item.sprite} alt={item.name} />
                <p className='item-flavor-text'>{item.flavor_text}</p>
                <div className='item-card-price'>
                  <p className='item-price'>{`₽ ${formatCost(item.cost)}`}</p>
                  <img className="item-cart-icon" src={cart_icon} alt="cart.png" />
                </div>
              </div>
            ))}
          </div>
          <div className='item-pagination-buttons'>
            <button onClick={handlePreviousPage} disabled={pageIndex === 0} className="prev-i">{'<'}</button>
            <button onClick={handleNextPage} disabled={(pageIndex + 14) >= itemData.length} className="next-i">{'>'}</button>
          </div>
        </>
      )}
    </>
  );
}

export { ItemCards };
