import React, { useEffect, useState } from 'react';
import '../../styles/Items.css'; // Ensure this is the correct path to your CSS

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

  const handleNextPage = () => {
    setPageIndex(prevIndex => prevIndex + 14);
  };

  const handlePreviousPage = () => {
    setPageIndex(prevIndex => Math.max(0, prevIndex - 14));
  };

  return (
    <div className="item-app">
      {loading ? (
        <div className="ring">Loading<span className='ring-span'></span></div>
      ) : (
        <>
          <div className="top-card-row">
            {itemData && itemData.slice(pageIndex, pageIndex + 5).map((item, index) => (
              <div className='card' key={index}>
                <h3 className='card-title'>{`#${item.id} ${item.name}`}</h3>
                <img className='sprite' src={item.sprite} alt={item.name} />
                <p className='flavor-text'>{item.flavor_text}</p>
                <p className='cost'>{`Cost: ${item.cost}`}</p>
              </div>
            ))}
          </div>
          <div className="bottom-card-row">
            {itemData && itemData.slice(pageIndex + 5, pageIndex + 10).map((item, index) => (
              <div className='card' key={index}>
                <h3 className='card-title'>{`#${item.id} ${item.name}`}</h3>
                <img className='sprite' src={item.sprite} alt={item.name} />
                <p className='flavor-text'>{item.flavor_text}</p>
                <p className='cost'>{`Cost: ${item.cost}`}</p>
              </div>
            ))}
          </div>
          <div className='pagination-buttons'>
            <button onClick={handlePreviousPage} disabled={pageIndex === 0} className="pagination-button">Previous</button>
            <button onClick={handleNextPage} disabled={(pageIndex + 14) >= itemData.length} className="pagination-button">Next</button>
            <div className="page-status">{`Page ${Math.floor(pageIndex / 14) + 1} of ${Math.ceil(itemData.length / 14)}`}</div>
          </div>
        </>
      )}
    </div>
  );
}

export { ItemCards };
