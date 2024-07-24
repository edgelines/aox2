import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App_test';
import Store from './store/index';
import { Provider } from 'react-redux';

// ReactDOM.render(<App />, document.getElementById('root'));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={Store}>
        <App />
    </Provider>
);
// // const controlLooksLikePasswordCredentialField = document.querySelector('input.password');
// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();