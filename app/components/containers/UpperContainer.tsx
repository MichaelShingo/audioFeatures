import { Box } from '@mui/system';
import WaveformContainer from './WaveformContainer';
import PlaybackControls from '../waveformControls/PlaybackControls';
import { useTheme } from '@mui/material';
import SeekHandleContainer from './SeekHandleContainer';
interface UpperContainerProps {}

const UpperContainer: React.FC<UpperContainerProps> = () => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				height: '100%',
				width: '100vw',
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
