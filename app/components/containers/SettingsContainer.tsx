'use client';
import { IconButton, Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { useState } from 'react';
import CustomModal from './CustomModal';
import { Box, Stack } from '@mui/system';
import CustomSlider from '../waveformControls/CustomSlider';
import { actions, useAppState } from '../../context/AppStateContext';

const SettingsContainer = () => {
	const { state, dispatch } = useAppState();
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

	return (
		<>
			<IconButton
				onClick={() => setIsSettingsModalOpen(true)}
				sx={{
					position: 'fixed',
					top: '0px',
					right: '0px',
					zIndex: 50,
				}}
			>
				<TuneIcon />
			</IconButton>
			<CustomModal isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen}>
				<Stack direction="column" spacing={3} sx={{ width: '85%' }}>
					<Box>
						<Typography variant="h5">Audio Volume</Typography>
						<CustomSlider
							min={0}
							max={100}
							value={state.audioVolume}
							handleChange={(event: Event, value: number | number[]) => {
								dispatch({ type: actions.SET_AUDIO_VOLUME, payload: value });
							}}
						/>
					</Box>
					<Box>
						<Typography variant="h5">Chord Volume</Typography>
						<CustomSlider
							min={0}
							max={100}
							value={state.chordVolume}
							handleChange={(event: Event, value: number | number[]) => {
								dispatch({ type: actions.SET_CHORD_VOLUME, payload: value });
							}}
						/>
					</Box>
				</Stack>
			</CustomModal>
		</>
	);
};

export default SettingsContainer;
