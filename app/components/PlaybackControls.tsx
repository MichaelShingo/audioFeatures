import { actions, useAppState } from '../context/AppStateContext';
import { Stack, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import Timecode from './Timecode';
import FilledIconButton from './FilledIconButton';
import ResizeInterface from './ResizeInterface';
import React, { ChangeEvent } from 'react';
import { styled } from '@mui/material';
import AudioUpload from './AudioUpload';

const PlaybackControls: React.FC = () => {
	const { state, dispatch } = useAppState();
	const theme = useTheme();

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			dispatch({ type: actions.SET_AUDIO_FILE, payload: file });
		}
	};

	return (
		<Stack direction="row" justifyContent="center">
			<Timecode />
			<AudioUpload />
			<FilledIconButton icon={<StopIcon />} />
			<FilledIconButton icon={<PlayArrowIcon />} />
			<FilledIconButton icon={<PauseIcon />} />
			<FilledIconButton icon={<KeyboardVoiceIcon />} />
			<ResizeInterface />
		</Stack>
	);
};

export default PlaybackControls;

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});
