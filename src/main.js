import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import App from './App.jsx';
import './styles/main.css';

createRoot(document.getElementById('root')).render(createElement(App));
