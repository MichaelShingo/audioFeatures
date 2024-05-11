'use client';
import { Box } from '@mui/system';
import { actions, useAppState } from '../../context/AppStateContext';
import { ReactNode, useEffect } from 'react';
import { audioSliceJSON } from '@/app/data/sampleBackendData';

type Chord = {
	symbol: string;
	start: number;
	end: number;
};

type AudioSlice = {
	C: number;
	'C#': number;
	D: number;
	'D#': number;
	E: number;
	F: number;
	'F#': number;
	G: number;
	'G#': number;
	A: number;
	'A#': number;
	B: number;
	start: number;
	end: number;
	series_id: number;
	chord_cluster: number;
	predicted_cluster: string;
	song: string;
};

const ChordSymbolContainer = () => {
	const { state } = useAppState();

	// API Call Here within useEffect //

	useEffect(() => {
		const parseAudioSlice = () => {
			const audioSliceData: Record<string, AudioSlice> = JSON.parse(audioSliceJSON);
			const audioSliceKeys: string[] = Object.keys(audioSliceData);

			const chords: Chord[] = [];
			let currentChord: Chord = {
				symbol: audioSliceData[0].predicted_cluster,
				start: audioSliceData[0].start,
				end: -1,
			};

			for (let i = 1; i < audioSliceKeys.length; i++) {
				const nextSlice: AudioSlice = audioSliceData[audioSliceKeys[i]];
				if (nextSlice.predicted_cluster !== currentChord.symbol) {
					currentChord.end = nextSlice.start;
					chords.push({ ...currentChord });
					currentChord = {
						symbol: nextSlice.predicted_cluster,
						start: nextSlice.start,
						end: -1,
					};
				}
			}
			console.log(chords);
		};

		parseAudioSlice();
	}, []);

	const generateChordSymbols = (): ReactNode[] => {
		const res: ReactNode[] = [];

		return res;
	};

	return (
		<Box
			sx={{
				pointerEvents: 'none',
				backgroundColor: 'red',
				height: '100%',
				minWidth: '100%',
				width: `${state.waveformContainerWidth}px`,
			}}
		>
			{generateChordSymbols()}
		</Box>
	);
};

export default ChordSymbolContainer;
