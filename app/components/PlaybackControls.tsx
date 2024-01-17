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
			player.current.sync().start(0);
		}
	}, [state.audioBuffer]);

	const playAudio = () => {
		Tone.start();
		const startTime: number = state.seconds;
		Tone.Transport.seconds = startTime;
		Tone.Transport.start();
		dispatch({ type: actions.SET_IS_PLAYING, payload: true });
	};

	const stopAudio = () => {
		Tone.Transport.stop();
		dispatch({ type: actions.SET_IS_PLAYING, payload: false });
		dispatch({
			type: actions.SET_SECONDS,
			payload: 0,
		});
	};

	const pauseAudio = () => {
		dispatch({ type: actions.SET_IS_PLAYING, payload: false });
		const currentTime: number = Tone.Transport.seconds;
		Tone.Transport.pause();
		dispatch({
			type: actions.SET_SECONDS,
			payload: currentTime,
		});
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
