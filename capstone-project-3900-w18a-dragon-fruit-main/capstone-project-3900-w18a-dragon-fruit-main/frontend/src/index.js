import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from "react-router-dom";

const theme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#8e2525',
            contrastText: '#f8f4ed',
        },
        secondary: {
            main: '#899668',
        },
        success: {
            main: '#5dbe8a',
        },
        error: {
            main: '#ee3f4d',
        },
        warning: {
            main: '#fb8b05',
        },
        info: {
            main: '#2f90b9',
        },
        divider: '#ef9a9a',
        background: {
            default: '#f8f4ed',
            paper: '#fafafa',
        },
    },
    typography: {
        fontFamily: 'Optima',
        h1: {
            fontFamily: 'Raghate',
        },
    }
});

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
