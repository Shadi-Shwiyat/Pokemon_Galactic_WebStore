import React, { useEffect, useState } from 'react';
import '../../styles/Items.css';

function ItemCards() {
  const [itemData, setItemData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getAllItems")
    .then(res => res.json())
    .then(data => {
        setItemData(data);
        setLoading(false);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
    });
  }, []);

  const handleNextPage = () => {
    setPageIndex(pageIndex + 20);
  };

  const handlePreviousPage = () => {
    setPageIndex(Math.max(0, pageIndex - 20));
  };

  return (
    <div className="item-app">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="item-container">
            {itemData.slice(pageIndex, pageIndex + 20).map((item, index) => (
              <div className='item-card' key={index}>
                <h3 className='item-card-title'>{`#${item.id} ${item.name}`}</h3>
                <img className='item-sprite' src={item.sprite} alt={item.name} />
                <p className='item-flavor-text'>{item.flavor_text}</p>
                <p className='item-cost'>{`Cost: ${item.cost}`}</p>
              </div>
            ))}
          </div>
          <div className='pagination-buttons'>
            <button onClick={handlePreviousPage} disabled={pageIndex === 0}>Previous</button>
            <button onClick={handleNextPage} disabled={(pageIndex + 20) >= itemData.length}>Next</button>
            <div className="page-status">{`Page ${Math.floor(pageIndex / 20) + 1} of ${Math.ceil(itemData.length / 20)}`}</div>
          </div>
        </>
      )}
    </div>
  );
}

export { ItemCards };
