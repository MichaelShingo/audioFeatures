import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { actions, useAppState } from '../context/AppStateContext';
import { IconButton, useTheme } from '@mui/material';

const ZoomSlider: React.FC = () => {
	const { state, dispatch } = useAppState();
	const theme = useTheme();

	const handleChange = (event: Event, newValue: number | number[]) => {
		dispatch({ type: actions.SET_ZOOM_FACTOR, payload: (newValue as number) / 100 });
	};

	const isDisabled = (): boolean => {
		return state.isPlaying || !state.isUploaded;
	};

	const incrementZoomFactor = (amount: number) => {
		dispatch({
			type: actions.SET_ZOOM_FACTOR,
			payload: state.zoomFactor + amount,
		});
	};

	return (
		<Box sx={{ width: 300 }}>
			<Stack spacing={1} direction="row" alignItems="center">
				<IconButton onClick={() => incrementZoomFactor(-0.01)}>
					<ZoomOutIcon />
				</IconButton>
				<Slider
					disabled={isDisabled()}
					min={20}
					max={600}
					size="small"
					valueLabelDisplay="auto"
					aria-label="zoom"
					value={Math.round(state.zoomFactor * 100)}
					onChange={handleChange}
					valueLabelFormat={(value: number) => `${value}%`}
					sx={{
						'& .MuiSlider-thumb': {
							borderRadius: '3px',
						},
						'& .Mui-disabled': {
							color: theme.palette.common.maroon,
						},
						'& .MuiSlider-rail': {
							color: isDisabled()
								? theme.palette.common.maroon
								: theme.palette.primary.light,
						},
						'& .MuiSlider-track': {
							color: isDisabled()
								? theme.palette.common.maroon
								: theme.palette.primary.light,
						},
						'&:disabled': {
							backgroundColor: theme.palette.common.maroon,
						},
					}}
				/>
				<IconButton onClick={() => incrementZoomFactor(0.01)}>
					<ZoomInIcon />
				</IconButton>
			</Stack>
		</Box>
	);
};

export default ZoomSlider;
