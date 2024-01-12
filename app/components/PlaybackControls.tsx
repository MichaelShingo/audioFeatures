import React from 'react';
import { actions, useAppState } from '../context/AppStateContext';
import { Stack, useTheme } from '@mui/material';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import FileUpload from '@mui/icons-material/FileUpload';
import Timecode from './Timecode';
import { Box } from '@mui/system';
import FilledIconButton from './FilledIconButton';
import PlayArrow from '@mui/icons-material/PlayArrow';

const PlaybackControls: React.FC = () => {
	const { state, dispatch } = useAppState();
	const theme = useTheme();

	return (
		<Stack direction="row" justifyContent="center">
			<Timecode />
			<FilledIconButton icon={<FileUpload />} />
			<FilledIconButton icon={<StopIcon />} />
			<FilledIconButton icon={<PlayArrowIcon />} />
			<FilledIconButton icon={<PauseIcon />} />
			<FilledIconButton icon={<KeyboardVoiceIcon />} />
			<IconButton sx={{ rotate: '90deg' }}>
				<DragIndicatorIcon />
			</IconButton>
		</Stack>
	);
};

export default PlaybackControls;
