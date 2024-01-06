import { createTheme } from '@mui/material/styles';
import { Righteous } from 'next/font/google';
const righteous = Righteous({
	weight: ['400'],
	style: ['normal'],
	subsets: ['latin'],
});

export const theme = createTheme({
	palette: {
		mode: 'dark',
		common: {
			brightRed: '#f52c40',
			darkRed: '#800924',
			maroon: '#512330',
			navy: '#232e45',
			darkGrey: '#161616',
		},
		primary: {
			main: '#800924',
			light: '#f52c40',
			dark: '#512330',
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
			100: '#0052d6',
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
		fontFamily: righteous.style.fontFamily,
		h1: {
			fontSize: '18vh',
			textAlign: 'center',
		},
		h3: {},
		button: {
			fontSize: '5rem',
		},
	},
});

export default theme;
