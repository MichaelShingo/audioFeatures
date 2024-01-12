import { Box } from '@mui/system';
import { ReactNode } from 'react';
import { actions, useAppState } from '../context/AppStateContext';
import Waveform from './Waveform';
import PlaybackControls from './PlaybackControls';
interface UpperContainerProps {}
const UpperContainer: React.FC<UpperContainerProps> = () => {
	const { state, dispatch } = useAppState();
	const positionPercentage: number = (state.resizePosition / state.windowHeight) * 100;
	return (
		<Box sx={{ height: `${positionPercentage}%`, backgroundColor: '', zIndex: 5 }}>
			<Waveform />
			<Box
				sx={{
					width: '100%',
					height: '10%',
					backgroundColor: '',
					padding: '3px',
				}}
			>
				<PlaybackControls />
			</Box>
		</Box>
	);
};

export default UpperContainer;
