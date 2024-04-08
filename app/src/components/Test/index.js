// In one of your React components
import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => console.log(data));
  }, []); // Empty dependency array means this effect runs once on mount

  return <div>Hello from React!</div>;
}

export default App;
