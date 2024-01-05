'use client';
import AppStateProvider from './context/AppStateContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/utils/theme';
import AppContainer from './components/AppContainer';
import AudioComponent from './components/AudioComponent';
import AudioUpload from './components/AudioUpload';
import Waveform from './components/Waveform';

export default function Home() {
	return (
		<ThemeProvider theme={theme}>
			<AppStateProvider>
				<AppContainer>
					<AudioComponent />
					<Waveform />
					<AudioUpload />
				</AppContainer>
			</AppStateProvider>
		</ThemeProvider>
	);
}
