import { Box } from '@mui/system';
import { useAppState } from '../../context/AppStateContext';
import WaveformSVG from '../waveformControls/WaveformSVG';
import SeekHandle from '../waveformControls/SeekHandle';
import { useEffect, useRef } from 'react';
import DraggableSelection from '../waveformControls/DraggableSelection';
import HoverMarker from '../waveformControls/HoverMarker';

const SeekHandleContainer = () => {
	const { state } = useAppState();
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const preventScroll = (e: MouseEvent) => {
			e.preventDefault();
		};
		if (ref.current) {
			ref.current.addEventListener('wheel', preventScroll);
			// ref.current.style.scrollbarWidth = 'none'; // Hide scrollbar for Firefox
			// ref.current.style['&::-webkit-scrollbar'] = {
			// 	display: 'none', // Hide the scrollbar for Chrome/Safari
			// };
		}
	}, []);
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
				height: '90%',
				overflowX: 'scroll',
				overflowY: 'scroll',
				paddingInline: '0px',
				flexDirection: 'column',
				gap: '0px',
				marginBottom: '7px',
				pointerEvents: 'none',
				display: state.isUploaded ? 'flex' : 'none',
			}}
		>
			<SeekHandle />
			<DraggableSelection />
			<HoverMarker />
			<Box sx={{ opacity: 0, zIndex: -5, height: '0px', pointerEvents: 'none' }}>
				<WaveformSVG />
			</Box>
		</div>
	);
};

export default SeekHandleContainer;
