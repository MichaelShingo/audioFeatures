'use client';
import AppStateProvider from './context/AppStateContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/utils/theme';
import AudioComponent from './components/audio/AudioComponent';
import UpperContainer from './components/containers/UpperContainer';
import MousePosition from './components/eventHandlers/MousePosition';
import MouseUpHandler from './components/eventHandlers/MouseUpHandler';
import MidiParser from './components/midi/MidiParser';
import WindowSizeTracker from './components/containers/WindowSizeTracker';
import SettingsContainer from './components/containers/SettingsContainer';

export default function Home() {
	return (
		<ThemeProvider theme={theme}>
			<AppStateProvider>
				<SettingsContainer />
				<MidiParser />
				<MousePosition />
				<MouseUpHandler />
				<AudioComponent />
				<UpperContainer />
				<WindowSizeTracker />
			</AppStateProvider>
		</ThemeProvider>
	);
}
