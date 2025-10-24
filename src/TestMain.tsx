import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const TestMain: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-500">Tailwind Test Page</h1>
      <p className="text-lg text-gray-700">This is a single-page test for Tailwind CSS.</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Test Button
      </button>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestMain />
  </React.StrictMode>
);