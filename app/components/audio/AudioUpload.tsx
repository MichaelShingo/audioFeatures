import React, { ChangeEvent, useEffect, useRef } from 'react';
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
	const nativeAudioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		new Tone.Limiter(-6).toDestination();
	}, []);

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: actions.SET_IS_UPLOADING, payload: true });
		const file = event.target.files?.[0];
		if (file) {
			const formData: FormData = new FormData();
			const blob = new Blob([file], { type: file.type });
			formData.append('user-file', blob, `user-file.${file.type}`);
			console.log('fletch');
			const result = await fetch(
				'https://corsproxy.io/?https://api.bellowswang.com/upload/',
				{
					method: 'POST',
					body: formData,
				}
			);
			console.log(result);

			dispatch({ type: actions.SET_AUDIO_FILE, payload: file });
		}
	};

	const startSilentOsc = async (e: React.MouseEvent) => {
		e.stopPropagation();
		await Tone.start();
		if (nativeAudioRef.current) {
			nativeAudioRef.current.play();
		}
	};

	return (
		<IconButton component="label" onClick={(e) => startSilentOsc(e)}>
			<audio ref={nativeAudioRef}>
				<source src="/silent.mp3" type="audio/mp3"></source>
			</audio>
			<FileUpload />
			<VisuallyHiddenInput type="file" accept="audio/*" onChange={handleFileChange} />
		</IconButton>
	);
};

export default AudioUpload;
