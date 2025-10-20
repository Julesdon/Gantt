/**import ReactDOM from 'react-dom/client' * main.tsx

import App from './App' * 

import './index.css' * React application bootstrap and DOM mounting point.

ReactDOM.createRoot(document.getElementById('root')!).render( * Purpose:

  <React.StrictMode> * - Initializes the React application

    <App /> * - Mounts the App component to the DOM

  </React.StrictMode>, * - Wraps the application in React.StrictMode for development checks*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import GridView from "./components/GridView/GridView";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GridView />
  </StrictMode>,
)
