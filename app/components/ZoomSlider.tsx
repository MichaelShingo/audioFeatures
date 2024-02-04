import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { actions, useAppState } from '../context/AppStateContext';

const ZoomSlider: React.FC = () => {
	const { state, dispatch } = useAppState();

	const handleChange = (event: Event, newValue: number | number[]) => {
		dispatch({ type: actions.SET_ZOOM_FACTOR, payload: newValue / 100 });
	};

	React.useEffect(() => {
		console.log(state.zoomFactor);
	}, [state.zoomFactor]);

	return (
		<Box sx={{ width: 300 }}>
			<Stack spacing={1} direction="row" sx={{ mb: 1 }} alignItems="center">
				<ZoomOutIcon />
				<Slider
					min={0}
					max={500}
					size="small"
					valueLabelDisplay="auto"
					aria-label="zoom"
					value={Math.round(state.zoomFactor * 100)}
					onChange={handleChange}
				/>
				<ZoomInIcon />
			</Stack>
		</Box>
	);
};

export default ZoomSlider;
