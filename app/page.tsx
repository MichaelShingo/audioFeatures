'use client';
import AppStateProvider from './context/AppStateContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/utils/theme';
import AppContainer from './components/containers/AppContainer';
import AudioComponent from './components/audio/AudioComponent';
import DataDisplay from './components/containers/DataDisplay';
import DataContainer from './components/containers/DataContainer';
import UpperContainer from './components/containers/UpperContainer';
import MousePosition from './components/eventHandlers/MousePosition';
import MouseUpHandler from './components/eventHandlers/MouseUpHandler';
import MidiParser from './components/midi/MidiParser';

export default function Home() {
	return (
		<ThemeProvider theme={theme}>
			<AppStateProvider>
				<AppContainer>
					<MidiParser />
					<MousePosition />
					<MouseUpHandler />
					<AudioComponent />
					<UpperContainer />
					<DataContainer>
						<DataDisplay />
					</DataContainer>
				</AppContainer>
			</AppStateProvider>
		</ThemeProvider>
	);
}
