import dynamic from 'next/dynamic';
import React from 'react';
import Loader from '../common/Loader/Loader';

const QuoteRotatorClient = dynamic(() => import('./QuoteRotatorClient'), {
  ssr: false,
  loading: () => <Loader/>
});

const QuoteRotator: React.FC = () => {
  return (
    <div className="quote-rotator-wrapper">
      <QuoteRotatorClient />
    </div>
  );
};

export default QuoteRotator;
