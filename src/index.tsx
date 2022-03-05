import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";

const TEXT_COLOR = "#dfcfb2";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    white: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    white?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    white: true;
  }
}

const theme = createTheme({
	components: {
		MuiAppBar: {
			styleOverrides: {
				root: {
					background: "#1a2d40",
					opacity: "90%"
				}
			}
		},
		MuiButton: {
			styleOverrides: {
				root: {
					color: TEXT_COLOR
				}
			}
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: "none"
				}
			}
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: "#395785",
					borderBottomWidth: "0.1rem"
				}
			}
		}
	},
	palette: {
		mode: "dark",
		primary: {
			main: "#103d6e",
		},
		secondary: {
			main: "#4889cf",
		},
		background: {
			default: "#101a28",
			paper: "#192B3D"
		},
		text: {
			primary: TEXT_COLOR,
			secondary: TEXT_COLOR+"90"
		}
	},
	typography: {
		allVariants: {
			color: TEXT_COLOR
		},
		white: {
			color: "#ffffff"
		}
	}
});

ReactDOM.render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<App />
			</ThemeProvider>
		</StyledEngineProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
