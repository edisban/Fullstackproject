import { createTheme } from "@mui/material/styles";

// Central blue theme with pleasant hovers and rounded corners
// Keep it lightweight and safe: no behavior changes, only visuals.
const theme = createTheme({
	palette: {
			mode: "light",
		// Earthy Green palette
		primary: {
			main: "#517d73", // mid sage/teal
			light: "#8fb296",
			dark: "#344e52",
			contrastText: "#ffffff",
		},
		secondary: {
			main: "#344e52", // deep slate green
			light: "#5d767a",
			dark: "#22363a",
			contrastText: "#ffffff",
		},
			background: {
				default: "#0f1f1c", // dark moss background across all routes
				paper: "#1e3a36", // lighter card tint
			},
		text: {
			primary: "#ffffff",
			secondary: "rgba(255,255,255,0.72)",
		},
	},
	shape: {
		borderRadius: 10,
	},
	typography: {
		fontFamily: [
			"Inter",
			"system-ui",
			"-apple-system",
			"Segoe UI",
			"Roboto",
			"Helvetica",
			"Arial",
			"sans-serif",
		].join(","),
		button: {
			textTransform: "none",
			fontWeight: 600,
		},
	},
	components: {
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundImage: "linear-gradient(90deg, #22363a 0%, #344e52 100%)",
				},
			},
		},
		MuiButton: {
			defaultProps: {
				disableElevation: true,
			},
			styleOverrides: {
				root: {
					borderRadius: 10,
				},
				containedPrimary: {
					backgroundImage: "linear-gradient(180deg, #5a8d82 0%, #517d73 100%)",
					boxShadow: "0 4px 12px rgba(81, 125, 115, 0.28)",
					':hover': {
						backgroundImage: "linear-gradient(180deg, #517d73 0%, #436a62 100%)",
						boxShadow: "0 6px 16px rgba(81, 125, 115, 0.35)",
					},
				},
				outlinedPrimary: {
					borderWidth: 2,
					':hover': {
						borderWidth: 2,
						backgroundColor: "rgba(81,125,115,0.08)",
					},
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundColor: "#1e3a36",
					color: "#ffffff",
					border: "1px solid rgba(255,255,255,0.12)",
					boxShadow: "0 8px 24px rgba(2,6,23,0.35)",
				},
				rounded: {
					borderRadius: 12,
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					transition: "transform 120ms ease, box-shadow 120ms ease",
					':hover': {
						transform: "translateY(-2px)",
						boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
					},
				},
			},
		},
		MuiListItem: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					'&:hover': {
						backgroundColor: "rgba(25,118,210,0.06)",
					},
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				variant: "outlined",
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					backgroundColor: "#ffffff",
					'& .MuiOutlinedInput-notchedOutline': {
						borderColor: "#cfd8e3",
					},
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: "#8fb296",
					},
					'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
						borderColor: "#517d73",
						borderWidth: 2,
					},
				},
				input: {
					color: "#0f172a",
					'&::placeholder': {
						color: "#8fb296",
						opacity: 1,
					},
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					color: "#0f172a",
					'&.Mui-focused': {
						color: "#517d73",
					},
				},
			},
		},
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						backgroundColor: "#0f1f1c", // enforce dark moss background
						color: "rgba(255,255,255,0.92)",
					},
					a: {
						color: "#5a8d82",
					},
				},
			},
	},
});

export default theme;

