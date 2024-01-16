import { actions, useAppState } from '../context/AppStateContext';
import { Stack, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import Timecode from './Timecode';
import FilledIconButton from './FilledIconButton';
import ResizeInterface from './ResizeInterface';
import React, { useEffect, useRef } from 'react';
import AudioUpload from './AudioUpload';
import * as Tone from 'tone';

const PlaybackControls: React.FC = () => {
	const { state, dispatch } = useAppState();
	const theme = useTheme();
	const player = useRef<Tone.Player | null>(null);

	useEffect(() => {
		if (state.audioBuffer) {
			player.current = new Tone.Player(state.audioBuffer).toDestination();
		}
	}, [state.audioBuffer]);

	const fps: number = 1 / 20;

	const playAudio = () => {
		Tone.start();
		const startTime: number = state.seconds;
		Tone.Transport.seconds = startTime;
		Tone.Transport.start();
		player.current?.start(0, startTime);
		Tone.Transport.scheduleRepeat(() => {
			const transportState: Tone.PlaybackState = Tone.Transport.state;
			const currentTime: number = Tone.Transport.seconds;
			if (transportState === 'started') {
				dispatch({ type: actions.SET_SECONDS, payload: currentTime });
			}
		}, fps);
		dispatch({ type: actions.SET_IS_PLAYING, payload: true });
	};

	const stopAudio = () => {
		player.current?.stop();
		Tone.Transport.stop();
		dispatch({ type: actions.SET_IS_PLAYING, payload: false });
		dispatch({
			type: actions.SET_SECONDS,
			payload: 0,
		});
	};

	const pauseAudio = () => {
		player.current?.stop();
		Tone.Transport.stop();
		dispatch({ type: actions.SET_IS_PLAYING, payload: false });

		if (state.audioContext) {
			dispatch({
				type: actions.SET_CURRENT_TIME,
				payload: state.audioContext.currentTime,
			});
			state.audioContext.suspend();
		}
	};

	const listenAudio = () => {
		console.log('listen');
	};

	return (
		<Stack
			direction="row"
			justifyContent="center"
			sx={{ backgroundColor: theme.palette.background.default }}
		>
			<Timecode />
			<AudioUpload />
			<FilledIconButton
				isActive={state.isPlaying}
				onClickHandler={stopAudio}
				icon={<StopIcon />}
			/>
			<FilledIconButton
				isActive={!state.isPlaying && state.isUploaded}
				onClickHandler={playAudio}
				icon={<PlayArrowIcon style={{}} />}
			/>
			<FilledIconButton
				isActive={state.isPlaying}
				onClickHandler={pauseAudio}
				icon={<PauseIcon />}
			/>
			<FilledIconButton
				isActive={!state.isPlaying}
				onClickHandler={listenAudio}
				icon={<KeyboardVoiceIcon />}
			/>
			<ResizeInterface />
		</Stack>
	);
};

export default PlaybackControls;
