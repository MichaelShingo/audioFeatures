'use client';
import AppStateProvider from './context/AppStateContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/utils/theme';
import AppContainer from './components/AppContainer';
import AudioComponent from './components/AudioComponent';

export default function Home() {
	return (
		<ThemeProvider theme={theme}>
			<AppStateProvider>
				<AppContainer>
					<AudioComponent />
				</AppContainer>
			</AppStateProvider>
		</ThemeProvider>
	);
}
