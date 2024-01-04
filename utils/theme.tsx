import { createTheme } from '@mui/material/styles';
import { Righteous } from 'next/font/google';

const righteous = Righteous({
	weight: ['400'],
	style: ['normal'],
	subsets: ['latin'],
});

export const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#1976d2',
			light: '#42a5f5',
			dark: '#1565c0',
		},
	},
	typography: {
		fontFamily: righteous.style.fontFamily,
		h1: {
			fontFamily: righteous.style.fontFamily,
		},
		h3: {},
		button: {
			fontSize: '5rem',
		},
	},
});

export default theme;
