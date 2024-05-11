'use client';
import { Box } from '@mui/system';
import { useAppState } from '../../context/AppStateContext';
import { ReactNode, useEffect, useState } from 'react';
import { audioSliceJSON } from '@/app/data/sampleBackendData';
import usePositionCalculations from '@/app/customHooks/usePositionCalculations';
import { Typography } from '@mui/material';
import { AudioSlice, Chord, parseAudioSlice } from '@/app/utils/parseAudioSlice';

const ChordSymbolContainer = () => {
	const { state } = useAppState();
	const [chords, setChords] = useState<Chord[] | null>(null);
	const { calcPositionFromSeconds } = usePositionCalculations();

	useEffect(() => {
		// API Call Here //
		const audioSliceData: Record<string, AudioSlice> = JSON.parse(audioSliceJSON);
		const chords: Chord[] = parseAudioSlice(audioSliceData);
		setChords(chords);
	}, []);

	const generateChordSymbols = (): ReactNode[] => {
		if (!chords) {
			return [];
		}
		const res: ReactNode[] = [];
		for (let i = 0; i < chords.length; i++) {
			res.push(
				<Box
					key={i}
					sx={{
						fontSize: state.windowHeight < 720 ? '12px' : '18px',
						backgroundColor: '',
						position: 'absolute',
						height: '100%',
						left: `${calcPositionFromSeconds(chords[i].start)}px`,
						width: `${calcPositionFromSeconds(chords[i].end - chords[i].start)}px`,
						pointerEvents: 'all',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'white',
					}}
				>
					<Typography>{chords[i].symbol}</Typography>
				</Box>
			);
		}

		return res;
	};

	return (
		<Box
			sx={{
				position: 'relative',
				zIndex: -1,
				pointerEvents: 'all',
				backgroundColor: '',
				height: '100%',
				minWidth: '100%',
				width: `${state.waveformContainerWidth}px`,
			}}
		>
			{chords && generateChordSymbols()}
		</Box>
	);
};

export default ChordSymbolContainer;
