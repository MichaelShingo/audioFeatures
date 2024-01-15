import { actions, useAppState } from '../context/AppStateContext';
import { Stack, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import Timecode from './Timecode';
import FilledIconButton from './FilledIconButton';
import ResizeInterface from './ResizeInterface';
import React, { ChangeEvent, useRef } from 'react';
import { styled } from '@mui/material';
import AudioUpload from './AudioUpload';

const PlaybackControls: React.FC = () => {
	const { state, dispatch } = useAppState();
	const theme = useTheme();

	const sourceNode = useRef<AudioBufferSourceNode | null>(null);
	console.log('currentTime', state.currentTime);

	const playAudio = () => {
		if (state.audioContext) {
			state.audioContext.resume();
		}
		dispatch({ type: actions.SET_IS_PLAYING, payload: true });

		if (state.audioContext && state.audioBuffer) {
			state.audioContext.resume();
			sourceNode.current = state.audioContext.createBufferSource();
			sourceNode.current.buffer = state.audioBuffer;
			sourceNode.current.connect(state.audioContext.destination);
			sourceNode.current.start(0, state.currentTime);

			const updateCurrentTime = () => {
				if (state.audioContext) {
					dispatch({
						type: actions.SET_CURRENT_TIME,
						payload: state.audioContext.currentTime,
					});
				}
				if (state.isPlaying) {
					requestAnimationFrame(updateCurrentTime);
				}
			};

			updateCurrentTime();
		}
	};

	const stopAudio = () => {
		dispatch({ type: actions.SET_IS_PLAYING, payload: false });
		dispatch({
			type: actions.SET_CURRENT_TIME,
			payload: 0,
		});
		if (sourceNode.current && state.audioContext) {
			sourceNode.current.stop();
			state.audioContext.suspend();
		}
	};

	const pauseAudio = () => {
		dispatch({ type: actions.SET_IS_PLAYING, payload: false });

		if (sourceNode.current && state.audioContext) {
			dispatch({
				type: actions.SET_CURRENT_TIME,
				payload: state.audioContext.currentTime,
			});
			sourceNode.current.stop();
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
				isActive={!state.isPlaying}
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
