import React, { ChangeEvent, useEffect, useRef } from 'react';
import { actions, useAppState } from '../../context/AppStateContext';
import { IconButton, styled } from '@mui/material';
import FileUpload from '@mui/icons-material/FileUpload';
import * as Tone from 'tone';
import { AudioSlice, Chord, parseAudioSlice } from '@/app/utils/parseAudioSlice';

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

type FileUploadResponse = {
	json_file_url: string;
	message: string;
	midi_file_url: string;
	original_filename: string;
};

const apiURL = 'https://api.bellowswang.com';

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
			dispatch({ type: actions.SET_AUDIO_FILE, payload: file });

			const formData: FormData = new FormData();
			formData.append('user_file', file, file.name);
			const response = await fetch(`${apiURL}/upload/`, {
				method: 'POST',
				body: formData,
			});

			const fileUploadJSON: FileUploadResponse = await response.json();

			console.log(fileUploadJSON);

			const midiFileResponse = await fetch(`${apiURL}${fileUploadJSON.midi_file_url}`, {
				method: 'GET',
			});

			console.log(midiFileResponse.body);
			dispatch({ type: actions.SET_MIDI_FILE, payload: midiFileResponse.body });

			const chordJSONResponse = await fetch(
				`${apiURL}/${fileUploadJSON.json_file_url.slice(1)}`,
				{
					method: 'GET',
				}
			);

			const audioSliceJSON: Record<string, AudioSlice> = await chordJSONResponse.json();

			const chords: Chord[] = parseAudioSlice(audioSliceJSON);
			dispatch({ type: actions.SET_CHORDS, payload: chords });
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
