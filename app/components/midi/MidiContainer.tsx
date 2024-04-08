import { Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import React, { ReactNode } from 'react';
import { useAppState } from '../../context/AppStateContext';
import usePositionCalculations from '@/app/customHooks/usePositionCalculations';

export const midiPitchToInt: Record<string, number> = {
	C: 0,
	'C#': 1,
	D: 2,
	'D#': 3,
	E: 4,
	F: 5,
	'F#': 6,
	G: 7,
	'G#': 8,
	A: 9,
	'A#': 10,
	B: 11,
};
const pitchList: string[] = [
	'C',
	'C#/Db',
	'D',
	'D#/Eb',
	'E',
	'F',
	'F#/Gb',
	'G',
	'G#/Ab',
	'A',
	'A#/Bb',
	'B',
];

const chords: Record<number, Set<string>> = {};

const addToChords = (startTime: number, pitch: string): void => {
	if (chords[startTime]) {
		chords[startTime].add(pitch);
	} else {
		const pitchSet: Set<string> = new Set();
		pitchSet.add(pitch);
		chords[startTime] = pitchSet;
	}
};

const MidiContainer = () => {
	const theme = useTheme();
	const { state } = useAppState();
	const { calcPositionFromSeconds } = usePositionCalculations();

	const generateNotes = (): ReactNode[][] => {
		const res: ReactNode[][] = [];
		for (let i = 0; i < 12; i++) {
			res.push([]);
		}

		if (state.midiData) {
			const track = state.midiData.tracks[0];

			for (let i = 0; i < track.notes.length; i++) {
				const note = track.notes[i];
				const pitchClassName: string = note.name.slice(0, -1);
				const pitchClass: number = midiPitchToInt[pitchClassName];

				const startTime: number = parseFloat(note.time.toFixed(2));
				addToChords(startTime, note.name.slice(0, -1));

				res[pitchClass].push(
					<Box
						key={i}
						sx={{
							fontSize: state.windowHeight < 720 ? '12px' : '18px',
							position: 'absolute',
							height: `${100 / 12}%`,
							backgroundColor: theme.palette.common.lightBlueTransSolid,
							left: `${calcPositionFromSeconds(note.time)}px`,
							width: `${calcPositionFromSeconds(note.duration)}px`,
							boxShadow: `inset 0 0 0 1px ${theme.palette.common.lightBlue}`,
							borderRadius: '6px',
							pointerEvents: 'all',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: theme.palette.common.lightBlue,
						}}
					>
						{pitchClassName}
					</Box>
				);
			}
		}
		return res;
	};

	const generateRows = (): ReactNode[] => {
		const res: ReactNode[] = [];
		const noteRows: ReactNode[][] = generateNotes();
		for (let i = 11; i >= 0; i--) {
			res.push(
				<Box
					key={i}
					sx={{
						height: `${100 / 12}%`,
						backgroundColor: i % 2 !== 0 ? theme.palette.common.lightBlue : 'none',
						display: 'flex',
						flexDirection: 'row',
						width: `${state.waveformContainerWidth}px`,
					}}
				>
					<Box
						sx={{
							backgroundColor: '',
							marginLeft: '3px',
							position: 'sticky',
							zIndex: 5,
						}}
					>
						<Typography
							sx={{
								display: 'none',
								position: 'absolute',
								transform: 'translateY(25%)',
								left: '0',
								color: 'white',
								zIndex: 10,
							}}
						>
							{pitchList[i]}
						</Typography>
					</Box>
					{noteRows[i]}
				</Box>
			);
		}
		return res;
	};

	return (
		<Box
			sx={{
				backgroundColor: '',
				transform: 'translateY(0%)',
				position: 'relative',
				width: '100%',
				height: '100%',
				zIndex: -1,
			}}
		>
			{generateRows()}
		</Box>
	);
};

export default MidiContainer;
