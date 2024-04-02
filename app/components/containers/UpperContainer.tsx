import { Box } from '@mui/system';
import { useAppState } from '../../context/AppStateContext';
import WaveformContainer from './WaveformContainer';
import PlaybackControls from '../waveformControls/PlaybackControls';
import { useTheme } from '@mui/material';
import SeekHandleContainer from './SeekHandleContainer';
interface UpperContainerProps {}

const UpperContainer: React.FC<UpperContainerProps> = () => {
	const { state } = useAppState();
	const theme = useTheme();
	const positionPercentage: number = (state.resizePosition / state.windowHeight) * 100;

	return (
		<Box
			sx={{
				height: `${positionPercentage}%`,
				backgroundColor: '',
			}}
		>
			<WaveformContainer />
			<SeekHandleContainer />
			<Box
				sx={{
					width: '100%',
					height: '10%',
					backgroundColor: theme.palette.background.default,
					padding: '3px',
					zIndex: '-1',
				}}
			>
				<PlaybackControls />
			</Box>
		</Box>
	);
};

export default UpperContainer;
