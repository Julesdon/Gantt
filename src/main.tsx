import React from 'react'/**

import ReactDOM from 'react-dom/client' * main.tsx

import App from './App' * 

import './index.css' * React application bootstrap and DOM mounting point.

 * 

ReactDOM.createRoot(document.getElementById('root')!).render( * Purpose:

  <React.StrictMode> * - Initializes the React application

    <App /> * - Mounts the App component to the DOM

  </React.StrictMode>, * - Wraps the application in React.StrictMode for development checks

) * 

 * Dependencies:
 * - React 19: Using StrictMode and createRoot API
 * - index.css: Global Tailwind CSS styles
 * - App: Root application component
 * 
 * Entry Point:
 * This is the entry point defined in index.html and Vite configuration.
 * It creates the React root and renders the application into the #root element.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
