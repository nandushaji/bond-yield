import React from 'react';
import type { BondResults } from '../types';

interface ResultsProps {
  results: BondResults;
}

export const Results: React.FC<ResultsProps> = ({ results }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Calculation Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Current Yield</p>
          <p className="text-2xl font-bold text-indigo-600">{(results.currentYield * 100).toFixed(2)}%</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Yield to Maturity (YTM)</p>
          <p className="text-2xl font-bold text-indigo-600">{(results.ytm * 100).toFixed(2)}%</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Total Interest Earned</p>
          <p className="text-2xl font-bold text-green-600">${results.totalInterest.toFixed(2)}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Status</p>
          <p className={`text-2xl font-bold ${
            results.indicator === 'Premium' ? 'text-blue-600' : 
            results.indicator === 'Discount' ? 'text-orange-600' : 'text-gray-600'
          }`}>
            {results.indicator}
          </p>
        </div>
      </div>
    </div>
  );
};
