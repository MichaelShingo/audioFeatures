import { Stack } from '@mui/system';
import { actions, useAppState } from '../context/AppStateContext';
import React from 'react';
import { Typography, useTheme } from '@mui/material';

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

	const setMinutes = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: actions.SET_MINUTES, payload: e.target.value });
	};
	const setSeconds = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: actions.SET_SECONDS, payload: e.target.value });
	};
	const setMilliseconds = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: actions.SET_MILLISECONDS, payload: e.target.value });
	};

	return (
		<Stack direction="row">
			<input
				type="number"
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinutes(e)}
				value={state.minutes}
				style={inputStyle}
			/>
			<Typography sx={colonStyle}>:</Typography>
			<input
				type="number"
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeconds(e)}
				value={state.seconds}
				style={inputStyle}
			/>
			<Typography sx={colonStyle}>:</Typography>
			<input
				type="number"
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMilliseconds(e)}
				value={state.milliseconds}
				style={inputStyle}
			/>
		</Stack>
	);
};

const colonStyle = { marginInline: '8px', fontSize: '1.3rem' };

export default Timecode;
