import dynamic from 'next/dynamic';
import React from 'react';

const QuoteRotatorClient = dynamic(() => import('./QuoteRotatorClient'), {
  ssr: false,
  loading: () => <div>Loading...</div> 
});

const QuoteRotator: React.FC = () => {
  return (
    <div className="quote-rotator-wrapper">
      <QuoteRotatorClient />
    </div>
  );
};

export default QuoteRotator;
