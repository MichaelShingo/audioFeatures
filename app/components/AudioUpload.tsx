import React, { ChangeEvent } from 'react';
import { actions, useAppState } from '../context/AppStateContext';
import { IconButton, styled } from '@mui/material';
import FileUpload from '@mui/icons-material/FileUpload';

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

const AudioUpload: React.FC = () => {
	const { dispatch } = useAppState();

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: actions.SET_IS_UPLOADING, payload: true });
		const file = event.target.files?.[0];
		if (file) {
			dispatch({ type: actions.SET_AUDIO_FILE, payload: file });
		}
	};

	return (
		<IconButton component="label">
			<FileUpload />
			<VisuallyHiddenInput type="file" accept="audio/*" onChange={handleFileChange} />
		</IconButton>
	);
};

export default AudioUpload;
