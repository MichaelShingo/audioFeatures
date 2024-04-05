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
		const preventScroll: EventListener = (e: MouseEvent) => {
			e.preventDefault();
		};
		if (ref.current) {
			ref.current.addEventListener('wheel', preventScroll);
			ref.current.addEventListener('touchmove', preventScroll);
			ref.current.addEventListener('scroll', preventScroll);
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
				backgroundColor: '',
				position: 'absolute',
				top: '0px',
				right: '0px',
				minWidth: '100vw',
				width: '100vw',
				height: '90%',
				zIndex: 50,
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
