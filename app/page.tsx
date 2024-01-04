'use client';
import AppStateProvider from './context/AppStateContext';
import KeyPressHandler from './components/KeyPressHandler';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/utils/theme';
import AppContainer from './components/AppContainer';
import AudioComponent from './components/AudioComponent';
import ModelCanvas from './components/3d/ModelCanvas';
import { Leva } from 'leva';

export default function Home() {
	return (
		<ThemeProvider theme={theme}>
			<Leva />
			<AppStateProvider>
				<AudioComponent />
				<KeyPressHandler />
				<AppContainer>
					{/* <ModelCanvas /> */}
				</AppContainer>
			</AppStateProvider>
		</ThemeProvider>
	);
}
