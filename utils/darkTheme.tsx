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
			darkBlue: '#0d3c72',
			mediumLight: '#337bb5',
			shadow: '#071e38',
			white: '#ffffff',
		},
		primary: {
			main: '#1976d2',
			light: '#42a5f5',
			dark: '#0d3c72',
		},
		error: {
			main: '#1976d2',
			light: '#42a5f5',
			dark: '#8f3d3d',
		},
		background: {
			paper: '#ffffff',
			default: '#ffffff',
		},
		grey: {
			50: '#005cf0',
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
