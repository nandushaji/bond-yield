import { useState } from 'react';
import axios from 'axios';
import { BondForm } from './components/BondForm';
import { Results } from './components/Results';
import { CashFlowTable } from './components/CashFlowTable';
import type { BondInputs, BondResults } from './types';

function App() {
  const [results, setResults] = useState<BondResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (data: BondInputs) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${apiUrl}/bond/calculate`, data);
      setResults(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const messages = err.response.data.message;
        setError(Array.isArray(messages) ? messages.join('. ') : messages);
      } else {
        setError('Failed to calculate bond yield. Please check your inputs and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Bond Yield Calculator
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Calculate Current Yield, YTM, and view detailed cash flow schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <BondForm onSubmit={handleCalculate} isLoading={isLoading} />

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {results && (
            <>
              <Results results={results} />
              <CashFlowTable cashFlows={results.cashFlows} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
