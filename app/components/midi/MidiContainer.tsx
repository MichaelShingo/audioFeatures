import { Tooltip, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import React, { ReactNode } from 'react';
import { actions, useAppState } from '../../context/AppStateContext';
import usePositionCalculations from '@/app/customHooks/usePositionCalculations';

const midiPitchToInt: Record<string, number> = {
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

const MidiContainer = () => {
	const theme = useTheme();
	const { state, dispatch } = useAppState();
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
				res[pitchClass].push(
					<Tooltip title={pitchClassName}>
						<Box
							key={i}
							sx={{
								position: 'absolute',
								height: '25px',
								backgroundColor: theme.palette.common.lightBlueTransSolid,
								left: calcPositionFromSeconds(note.time),
								width: calcPositionFromSeconds(note.duration),
								boxShadow: `inszet 0 0 0 1px ${theme.palette.common.lightBlue}`,
								borderRadius: '6px',
							}}
						>
							{/* {pitchClassName} */}
						</Box>
					</Tooltip>
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
						backgroundColor: i % 2 !== 0 ? theme.palette.common.darkGrey : 'none',
						display: 'flex',
						flexDirection: 'row',
					}}
				>
					<Typography
						sx={{ position: 'fixed', margin: '3px', color: 'white', zIndex: 10 }}
					>
						{pitchList[i]}
					</Typography>
					{noteRows[i]}
				</Box>
			);
		}
		return res;
	};

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				height: '40%',
				zIndex: -1,
				transform: 'translateY(37%)',
			}}
		>
			{generateRows()}
		</Box>
	);
};

export default MidiContainer;
