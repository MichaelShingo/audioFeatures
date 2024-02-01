import { Stack } from '@mui/system';
import { useAppState, actions } from '../context/AppStateContext';
import React, { useEffect, useRef, useState } from 'react';
import { Typography, useTheme } from '@mui/material';
import * as Tone from 'tone';
import TimecodeInput from './TimecodeInput';

const calcMinutes = (seconds: number): string => {
	return Math.floor(seconds / 60).toString();
};
const calcSeconds = (seconds: number): string => {
	return Math.floor(seconds % 60).toString();
};
const calcMilliseconds = (seconds: number): string => {
	return Math.round((seconds * 1000) % 1000).toString();
};

const colonStyle = { marginInline: '8px', fontSize: '1.6rem' };

const Timecode = () => {
	const { state, dispatch } = useAppState();

	const refMinutes = useRef<HTMLInputElement>(null);
	const refSeconds = useRef<HTMLInputElement>(null);
	const refMilliseconds = useRef<HTMLInputElement>(null);

	const [prevMinutes, setPrevMinutes] = useState<number>(0);
	const [prevSeconds, setPrevSeconds] = useState<number>(0);
	const [prevMilliseconds, setPrevMilliseconds] = useState<number>(0);

	const setTimecode = (seconds: number): void => {
		if (refMilliseconds.current && refSeconds.current && refMinutes.current) {
			refMilliseconds.current.value = calcMilliseconds(seconds);
			refSeconds.current.value = calcSeconds(seconds);
			refMinutes.current.value = calcMinutes(seconds);
		}
	};

	useEffect(() => {
		if (Tone.Transport.state === 'started') {
			Tone.Transport.scheduleRepeat(
				(time) => {
					Tone.Draw.schedule(() => setTimecode(Tone.Transport.seconds), time);
				},
				1 / 24,
				0
			);
		} else {
			setTimecode(state.seconds);
		}
	}, [state.isPlaying, state.seconds]);

	const handleBlurMinutes = (): void => {
		const difference: number =
			(parseInt(refMinutes.current?.value as string) - prevMinutes) * 60;
		dispatch({ type: actions.SET_SECONDS, payload: state.seconds + difference });
	};

	const handleBlurSeconds = (): void => {
		const difference: number =
			parseInt(refSeconds.current?.value as string) - prevSeconds;
		dispatch({ type: actions.SET_SECONDS, payload: state.seconds + difference });
	};

	const handleBlurMilliseconds = (): void => {
		const difference: number =
			(parseInt(refMilliseconds.current?.value as string) - prevMilliseconds) / 1000;
		dispatch({ type: actions.SET_SECONDS, payload: state.seconds + difference });
	};

	const handleFocusMinutes = (): void => {
		const currentMinutes: number = parseInt(refMinutes.current?.value as string);
		setPrevMinutes(currentMinutes);
	};

	const handleFocusSeconds = (): void => {
		const currentSeconds: number = parseInt(refSeconds.current?.value as string);
		setPrevSeconds(currentSeconds);
	};

	const handleFocusMilliseconds = (): void => {
		const currentMilliseconds: number = parseInt(
			refMilliseconds.current?.value as string
		);
		setPrevMilliseconds(currentMilliseconds);
	};

	useEffect(() => {
		console.log(prevMilliseconds, state.seconds);
	}, [prevMilliseconds, state.seconds]);

	return (
		<Stack direction="row" sx={{ marginRight: '5px' }}>
			<TimecodeInput
				refObj={refMinutes}
				handleBlur={handleBlurMinutes}
				handleFocus={handleFocusMinutes}
			/>
			<Typography sx={colonStyle}>:</Typography>
			<TimecodeInput
				refObj={refSeconds}
				handleBlur={handleBlurSeconds}
				handleFocus={handleFocusSeconds}
			/>
			<Typography sx={colonStyle}>:</Typography>
			<TimecodeInput
				refObj={refMilliseconds}
				handleBlur={handleBlurMilliseconds}
				handleFocus={handleFocusMilliseconds}
			/>
		</Stack>
	);
};

export default Timecode;
