import { Stack } from '@mui/system';
import { actions, useAppState } from '../context/AppStateContext';
import React, { useEffect } from 'react';
import { Typography, useTheme } from '@mui/material';

const calcMinutes = (currentTimeInSeconds: number): number => {
	return Math.floor(currentTimeInSeconds / 60);
};
const calcSeconds = (currentTimeInSeconds: number): number => {
	return Math.floor(currentTimeInSeconds % 60);
};
const calcMilliseconds = (currentTimeInSeconds: number): number => {
	return Math.round((currentTimeInSeconds * 1000) % 1000);
};

const Timecode = () => {
	const { state, dispatch } = useAppState();
	const theme = useTheme();

	const inputStyle = {
		backgroundColor: theme.palette.common.mediumGrey,
		color: 'white',
		fontFamily: theme.typography.fontFamily,
		fontSize: '30px',
		width: '50px',
		margin: '0',
		padding: '0',
		border: '0',
		borderRadius: '10px',
		textAlign: 'center' as const,
	};

	return (
		<Stack direction="row" sx={{ marginRight: '5px' }}>
			<input
				type="number"
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinutes(e)}
				value={calcMinutes(state.seconds)}
				style={inputStyle}
			/>
			<Typography sx={colonStyle}>:</Typography>
			<input
				type="number"
				onChange={(e) => setSeconds(e)}
				value={calcSeconds(state.seconds)}
				style={inputStyle}
			/>
			<Typography sx={colonStyle}>:</Typography>
			<input
				type="number"
				onChange={(e) => setMilliseconds(e)}
				value={calcMilliseconds(state.seconds)}
				style={inputStyle}
			/>
		</Stack>
	);
};

const colonStyle = { marginInline: '8px', fontSize: '1.6rem' };

export default Timecode;
