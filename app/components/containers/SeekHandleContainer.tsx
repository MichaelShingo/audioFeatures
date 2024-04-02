import { Box } from '@mui/system';
import { actions, useAppState } from '../../context/AppStateContext';
import WaveformSVG from '../waveformControls/WaveformSVG';
import SeekHandle from '../waveformControls/SeekHandle';
import { useEffect, useRef } from 'react';

const SeekHandleContainer = () => {
	const { state, dispatch } = useAppState();
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollLeft = state.waveformScrollPosition;
		}
	}, [state.waveformScrollPosition]);

	return (
		<div
			id="seek-handle-container"
			ref={ref}
			style={{
				position: 'absolute',
				top: '0px',
				right: '0px',
				minWidth: '100vw',
				width: `${state.waveformContainerWidth}px`, // deleting this makes seek handle disappear
				backgroundColor: '',
				zIndex: 50,
				height: '78.4%',
				overflowX: 'scroll',
				overflowY: 'scroll',
				paddingInline: '0px',
				display: 'flex',
				flexDirection: 'column',
				gap: '0px',
				marginBottom: '7px',
				pointerEvents: 'none',
			}}
		>
			<SeekHandle />
			<Box sx={{ opacity: 0.5, zIndex: -5, height: '0px' }}>
				<WaveformSVG />
			</Box>
		</div>
	);
};

export default SeekHandleContainer;
