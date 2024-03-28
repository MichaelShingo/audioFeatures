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
				// let prevDuration: number = 0;
				// if (i > 0) {
				// 	prevDuration = track.notes[i - 1].duration;
				// }
				res[pitchClass].push(
					<Tooltip key={i} title={pitchClassName} sx={{ pointerEvents: 'all' }}>
						<Box
							sx={{
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
						width: '2000px', // TODO set the width according to audio length
					}}
				>
					<Box
						sx={{
							backgroundColor: theme.palette.common.darkGrey,
						}}
					>
						<Typography
							sx={{
								position: 'sticky',
								transform: 'translateY(25%)',
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