import { Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import React, { ReactNode } from 'react';

const pitchList: string[] = [
	'B',
	'A#/Bb',
	'A',
	'G#/Ab',
	'G',
	'F#/Gb',
	'F',
	'E',
	'D#/Eb',
	'D',
	'C#/Db',
	'C',
];

const MidiContainer = () => {
	const theme = useTheme();

	const generateRows = (): ReactNode[] => {
		const res: ReactNode[] = [];
		for (let i = 0; i < 12; i++) {
			res.push(
				<Box
					key={i}
					sx={{
						height: `${100 / 12}%`,
						backgroundColor: i % 2 === 0 ? theme.palette.common.darkGrey : 'none',
					}}
				>
					<Typography sx={{ position: 'fixed', margin: '3px', color: 'white' }}>
						{pitchList[i]}
					</Typography>
				</Box>
			);
		}
		return res;
	};

	return (
		<Box
			sx={{
				position: 'absolute',
				width: '100%',
				height: '40%',
				zIndex: -1,
				transform: 'translateY(37%)',
				pointerEvents: 'none',
			}}
		>
			{generateRows()}
		</Box>
	);
};

export default MidiContainer;
