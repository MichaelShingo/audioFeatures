import { Stack } from '@mui/system';
import { useAppState, actions } from '../context/AppStateContext';
import React, { useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import * as Tone from 'tone';
import TimecodeInput from './TimecodeInput';
import usePositionCalculations from '../customHooks/usePositionCalculations';

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
	const { calcPositionFromSeconds, isPositionInCurrentView } = usePositionCalculations();
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
		const fps: number = 1 / 24;
		const startTime: number = 0;
		if (Tone.Transport.state === 'started') {
			Tone.Transport.scheduleRepeat(
				(time) => {
					Tone.Draw.schedule(() => setTimecode(Tone.Transport.seconds), time);
				},
				fps,
				startTime
			);
		} else {
			setTimecode(state.seconds);
		}
	}, [state.isPlaying, state.seconds]);

	const handlePositionUpdate = (differenceInSeconds: number): void => {
		const newSeconds: number = state.seconds + differenceInSeconds;

		dispatch({ type: actions.SET_SECONDS, payload: newSeconds });

		const newPosition: number = calcPositionFromSeconds(newSeconds);

		if (!isPositionInCurrentView(newPosition)) {
			dispatch({
				type: actions.SET_WAVEFORM_SCROLL_POSITION,
				payload: newPosition - state.windowWidth / 2,
			});
		}
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

	const handleBlurMinutes = (): void => {
		const difference: number =
			(parseInt(refMinutes.current?.value as string) - prevMinutes) * 60;
		handlePositionUpdate(difference);
	};

	const handleBlurSeconds = (): void => {
		const difference: number =
			parseInt(refSeconds.current?.value as string) - prevSeconds;
		handlePositionUpdate(difference);
	};

	const handleBlurMilliseconds = (): void => {
		const difference: number =
			(parseInt(refMilliseconds.current?.value as string) - prevMilliseconds) / 1000;
		handlePositionUpdate(difference);
	};

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
