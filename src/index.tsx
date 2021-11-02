import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiAppBar: {
      defaultProps: {
        enableColorOnDark: true,
      },
    }
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#103d6e',
    },
    secondary: {
      main: '#4889cf',
    },
    background: {
      default: '#1a1c1e',
      paper: '#1a1d22'
    }
  },
});

ReactDOM.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
