import { Stack } from '@mui/system';
import { actions, useAppState } from '../context/AppStateContext';
import React from 'react';
import { Typography } from '@mui/material';

const Timecode = () => {
	const { state, dispatch } = useAppState();

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
				value={state.minutes}
				style={inputStyle}
			/>
			<Typography sx={colonStyle}>:</Typography>
			<input
				type="number"
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMilliseconds(e)}
				value={state.minutes}
				style={inputStyle}
			/>
		</Stack>
	);
};

const colonStyle = { marginInline: '8px', fontSize: '1.3rem' };

const inputStyle = {
	backgroundColor: 'grey',
	width: '50px',
	margin: '0',
	padding: '0',
	border: '0',
};

export default Timecode;
