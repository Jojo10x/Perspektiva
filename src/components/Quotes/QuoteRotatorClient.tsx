'use client'

import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/Quote/QuoteRotator.module.scss';
import quotesData from './quotes.json';

interface Quote {
  quote: string;
  author: string;
}

const QuoteRotatorClient: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const quotes: Quote[] = quotesData.Quotes;

  useEffect(() => {
    setIsLoading(false);
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 10000); 

    return () => clearInterval(interval);
  }, [quotes.length]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className={styles.quoteContainer}>
      <div className={styles.quote}>
        "{currentQuote.quote}"
      </div>
      <div className={styles.author}>
        - {currentQuote.author}
      </div>
    </div>
  );
};

export default QuoteRotatorClient;