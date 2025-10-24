import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import MinimalTest from '../../src/MinimalTest';

console.log('React app is mounting...');

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MinimalTest />
  </React.StrictMode>
);


