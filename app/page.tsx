'use client';
import AppStateProvider from './context/AppStateContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/utils/theme';
import AppContainer from './components/AppContainer';
import AudioComponent from './components/AudioComponent';
import DataDisplay from './components/DataDisplay';
import DataContainer from './components/DataContainer';
import UpperContainer from './components/UpperContainer';

export default function Home() {
	return (
		<ThemeProvider theme={theme}>
			<AppStateProvider>
				<AppContainer>
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
