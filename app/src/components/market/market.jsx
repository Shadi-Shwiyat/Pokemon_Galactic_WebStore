import React, { useState, useEffect } from 'react';
import { Market_filter } from './filter_market';
import { Market_cards } from './market_cards';

export function Market() {

  return (
    <>
      <Market_filter />
      <Market_cards />
    </>
  );
}