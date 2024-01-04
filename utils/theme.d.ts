import { ThemeOptions } from '@mui/material';

declare module '@mui/material' {
	interface ThemeOptions {
		status: {
			danger: React.CSSProperties['color'];
		};
	}
}
