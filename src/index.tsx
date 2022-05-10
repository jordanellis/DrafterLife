import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";

const PRIMARY = "#222831";
const PRIMARY_50 = "#30475E";
const SECONDARY = "#C1A57B";
const TEXT_COLOR = "#ECECEC";

// const PRIMARY = "#191919";
// const PRIMARY_50 = "#2D4263";
// const SECONDARY = "#C84B31";
// const TEXT_COLOR = "#ECDBBA";

// const PRIMARY = "#1C2B2D";
// const PRIMARY_50 = "#1F6F8B";
// const SECONDARY = "#99A8B2";
// const TEXT_COLOR = "#E6D5B8";

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
					background: PRIMARY,
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
			main: PRIMARY_50,
		},
		secondary: {
			main: SECONDARY,
		},
		background: {
			default: PRIMARY,
			paper: PRIMARY_50
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
