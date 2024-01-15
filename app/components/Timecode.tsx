import { Stack } from '@mui/system';
import { actions, useAppState } from '../context/AppStateContext';
import React from 'react';
import { Typography, useTheme } from '@mui/material';
import { Time } from '../utils/timecodeCalculations';

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
		dispatch({ type: actions.SET_MINUTES, payload: parseInt(e.target.value) });
	};
	const setSeconds = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: actions.SET_SECONDS, payload: parseInt(e.target.value) });
	};
	const setMilliseconds = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: actions.SET_MILLISECONDS, payload: parseInt(e.target.value) });
		// dispatch({
		// 	type: actions.SET_TIMECODE,
		// 	payload: { minutes: 0, seconds: 0, milliseconds: parseInt(e.target.value) },
		// });
	};

	// const setTimecode = (e: React.ChangeEvent<HTMLInputElement>, time: Time) => {
	// 	dispatch({
	// 		type: actions.SET_TIMECODE,
	// 		payload: { minutes: 0, seconds: 0, milliseconds: 0 },
	// 	});
	// };

	return (
		<Stack direction="row" sx={{ marginRight: '5px' }}>
			<input
				type="number"
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinutes(e)}
				value={state.minutes}
				style={inputStyle}
			/>
			<Typography sx={colonStyle}>:</Typography>
			<input
				type="number"
				onChange={(e) => setSeconds(e)}
				value={state.seconds}
				style={inputStyle}
			/>
			<Typography sx={colonStyle}>:</Typography>
			<input
				type="number"
				onChange={(e) => setMilliseconds(e)}
				value={state.milliseconds}
				style={inputStyle}
			/>
		</Stack>
	);
};

const colonStyle = { marginInline: '8px', fontSize: '1.6rem' };

export default Timecode;
