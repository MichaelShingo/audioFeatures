import { createTheme } from '@mui/material/styles';
import { Share_Tech } from 'next/font/google';
const shareTech = Share_Tech({
	weight: ['400'],
	style: ['normal'],
	subsets: ['latin'],
});

export const theme = createTheme({
	palette: {
		mode: 'dark',
		common: {
			brightRed: '#df4440',
			darkRed: '#800924',
			maroon: '#512330',
			navy: '#232e45',
			darkGrey: '#2d2e2e',
			lightGrey: '#423c3b',
			mediumGrey: '#2e2e2e',
			lightBlue: '#02b0fe',
		},
		primary: {
			main: '#df4440',
			light: '#df4440',
			dark: '#df4440',
		},
		secondary: {
			main: '#232e45',
			light: '#f52c40',
			dark: '#0d3c72',
		},
		error: {
			main: '#1976d2',
			light: '#42a5f5',
			dark: '#8f3d3d',
		},
		background: {
			paper: '#161616',
			default: '#161616',
		},
		grey: {
			50: '#636363',
			100: '#636363',
			200: '#0044b3',
			300: '#305a9c',
			400: '#002e78',
			500: '#00235c',
			600: '#001942',
			700: '#001330',
			800: '#000b1c',
			900: '#00060f',
		},
		text: {
			primary: '#000000',
		},
	},
	typography: {
		fontFamily: shareTech.style.fontFamily,
		h1: {
			fontSize: '18vh',
			textAlign: 'center',
		},
		h3: {},
		button: {
			fontSize: '1rem',
		},
	},
});

export default theme;
