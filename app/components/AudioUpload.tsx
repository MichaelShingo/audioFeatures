import React, { ChangeEvent } from 'react';
import { actions, useAppState } from '../context/AppStateContext';
import { Button, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
		const file = event.target.files?.[0];
		if (file) {
			dispatch({ type: actions.SET_AUDIO_FILE, payload: file });
		}
	};

	return (
		<Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
			Upload Audio
			<VisuallyHiddenInput type="file" accept="audio/*" onChange={handleFileChange} />
		</Button>
	);
};

export default AudioUpload;
