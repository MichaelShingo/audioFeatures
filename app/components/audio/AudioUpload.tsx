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

const loadingStates: string[] = [
	'Sending audio data to server',
	'Extracting pitch data',
	'Analyzing chord content',
	'Generating midi file',
	'Packaging response',
];

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
			try {
				const estServerResponseTime: number = file.size / 200;
				const loadingStateInterval: number = estServerResponseTime / loadingStates.length;

				dispatch({ type: actions.SET_AUDIO_FILE, payload: file });

				const formData: FormData = new FormData();
				formData.append('user_file', file, file.name);

				for (let i = 0; i < loadingStates.length; i++) {
					setTimeout(() => {
						dispatch({ type: actions.SET_LOADING_STATE, payload: loadingStates[i] });
					}, loadingStateInterval * i);
				}

				const response = await fetch(`${apiURL}/upload/`, {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					throw new Error('Analysis failed, please try again.');
				}

				dispatch({ type: actions.SET_LOADING_STATE, payload: 'Parsing server response' });
				const fileUploadJSON: FileUploadResponse = await response.json();

				dispatch({ type: actions.SET_LOADING_STATE, payload: 'Fetching midi data' });
				const midiFileResponse = await fetch(`${apiURL}${fileUploadJSON.midi_file_url}`, {
					method: 'GET',
				});

				if (!midiFileResponse.ok) {
					throw new Error('Midi generation failed, please try again.');
				}

				dispatch({ type: actions.SET_MIDI_FILE, payload: midiFileResponse.body });
				dispatch({ type: actions.SET_LOADING_STATE, payload: 'Fetching chord data' });

				const chordJSONResponse = await fetch(
					`${apiURL}${fileUploadJSON.json_file_url}`,
					{
						method: 'GET',
					}
				);

				if (!chordJSONResponse.ok) {
					throw new Error('Chord analysis failed, please try again.');
				}

				dispatch({ type: actions.SET_LOADING_STATE, payload: 'Parsing chord data' });
				const audioSliceJSON: Record<string, AudioSlice> = await chordJSONResponse.json();
				const chords: Chord[] = parseAudioSlice(audioSliceJSON);
				dispatch({ type: actions.SET_LOADING_STATE, payload: 'Complete' });
				dispatch({ type: actions.SET_CHORDS, payload: chords });
				dispatch({ type: actions.SET_IS_UPLOADING, payload: false });
				dispatch({ type: actions.SET_IS_UPLOADED, payload: true });
			} catch (e) {
				if (e instanceof Error) {
					dispatch({ type: actions.SET_ERROR_STATE, payload: e.message });
					dispatch({ type: actions.SET_IS_UPLOADING, payload: false });
				}
			}
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
