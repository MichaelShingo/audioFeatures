'use client';
import { Box } from '@mui/system';
import { useAppState } from '../../context/AppStateContext';
import { ReactNode } from 'react';
import usePositionCalculations from '@/app/customHooks/usePositionCalculations';
import { Typography } from '@mui/material';

const ChordSymbolContainer = () => {
	const { state } = useAppState();
	const { calcPositionFromSeconds } = usePositionCalculations();

	const generateChordSymbols = (): ReactNode[] => {
		if (!state.chords) {
			return [];
		}
		const res: ReactNode[] = [];

		for (let i = 0; i < state.chords.length; i++) {
			res.push(
				<Box
					key={i}
					sx={{
						fontSize: state.windowHeight < 720 ? '12px' : '18px',
						backgroundColor: '',
						position: 'absolute',
						height: '100%',
						left: `${calcPositionFromSeconds(state.chords[i].start)}px`,
						width: `${calcPositionFromSeconds(
							state.chords[i].end - state.chords[i].start
						)}px`,
						pointerEvents: 'all',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'white',
					}}
				>
					<Typography
						sx={{
							pointerEvents: 'all',
							zIndex: 60,
							fontSize: state.zoomFactor < 0.4 ? '10px' : '20px',
						}}
					>
						{state.chords[i].symbol}
					</Typography>
				</Box>
			);
		}

		return res;
	};

	return (
		<Box
			sx={{
				position: 'relative',
				zIndex: 50,
				pointerEvents: 'all',
				backgroundColor: '',
				height: '100%',
				minWidth: '100%',
				width: `${state.waveformContainerWidth}px`,
			}}
		>
			{state.chords && generateChordSymbols()}
		</Box>
	);
};

export default ChordSymbolContainer;
