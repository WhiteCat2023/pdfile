
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Ensure global styles are here
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Set the workerSrc for pdf.js to use the local worker file.
// The file was copied to the `public` directory, so it's available at the root.
GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
