import React, { ChangeEvent, useEffect, useState } from 'react';
import { actions, useAppState } from '../../context/AppStateContext';
import { IconButton, styled } from '@mui/material';
import FileUpload from '@mui/icons-material/FileUpload';
import * as Tone from 'tone';

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
	const [silentOsc, setSilentOsc] = useState<Tone.Oscillator | null>(null);
	useEffect(() => {
		const newOsc = new Tone.Oscillator(0, 'sine').toDestination();
		setSilentOsc(newOsc);
	}, []);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: actions.SET_IS_UPLOADING, payload: true });
		const file = event.target.files?.[0];
		if (file) {
			dispatch({ type: actions.SET_AUDIO_FILE, payload: file });
		}
	};

	const startSilentOsc = async () => {
		await Tone.start();
		try {
			if (silentOsc) {
				silentOsc.mute = true;
				silentOsc.start('+0.5');
				Tone.Transport.cancel();
			}
		} catch (e) {
			return;
		}
	};

	return (
		<IconButton component="label" onClick={startSilentOsc}>
			<FileUpload />
			<VisuallyHiddenInput type="file" accept="audio/*" onChange={handleFileChange} />
		</IconButton>
	);
};

export default AudioUpload;
