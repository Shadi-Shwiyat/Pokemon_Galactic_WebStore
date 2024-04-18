import React, { useState, useEffect } from 'react';
import { Market_filter } from './filter_market';
import { Market_cards } from './market_cards';

export function Market() {
  const [mfilters, setmFilters] = useState({});
  const [mclear, setmClear] = useState(false);

  return (
    <>
      <Market_filter mfilters={mfilters} setmFilters={setmFilters} mclear={mclear} setmClear={setmClear} />
      <Market_cards mfilters={mfilters} mclear={mclear} setmClear={setmClear} />
    </>
  );
}