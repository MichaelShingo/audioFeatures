import { actions, useAppState } from '../../context/AppStateContext';
import { IconButton, Stack, Typography, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Timecode from './Timecode';
import FilledIconButton from './FilledIconButton';
import React, { useEffect, useState } from 'react';
import AudioUpload from '../audio/AudioUpload';
import * as Tone from 'tone';
import ZoomSlider from './ZoomSlider';
import useIsMobile from '@/app/customHooks/useIsMobile';
import { mapRange } from '@/app/utils/mapRange';
import {
	calcMilliseconds,
	calcMinutes,
	calcSeconds,
} from '@/app/utils/timecodeCalculations';
import { Box } from '@mui/system';
import CustomModal from '../containers/CustomModal';

let scheduleRepeaterId: number = -1;

const PlaybackControls: React.FC = () => {
	const { state, dispatch } = useAppState();
	const theme = useTheme();
	const [player, setPlayer] = useState<Tone.Player | null>(null);
	const [isTimecodeModalOpen, setIsTimecodeModalOpen] = useState<boolean>(false);
	const isMobile = useIsMobile();

	useEffect(() => {
		if (player) {
			player.volume.value = mapRange(state.audioVolume, 0, 100, -60, 0);
		}
	}, [state.audioVolume]);

	useEffect(() => {
		if (player) {
			Tone.Transport.cancel(0);
			player.dispose();
		}
		if (state.audioBuffer) {
			setPlayer(new Tone.Player(state.audioBuffer).toDestination());
		}
	}, [state.audioBuffer]);

	useEffect(() => {
		player?.sync().start(0);
	}, [player]);

	useEffect(() => {
		if (scheduleRepeaterId !== -1) {
			Tone.Transport.clear(scheduleRepeaterId);
		}
		if (state.isUploading) {
			stopAudio();
		}
	}, [state.isUploading]);

	const checkIsEndofAudioFile = (transportTime: number, audioDuration: number) => {
		if (transportTime > audioDuration) {
			stopAudio();
		}
	};

	const playAudio = () => {
		const startTime: number = state.seconds;
		Tone.start();
		Tone.Transport.seconds = startTime;

		Tone.Transport.start();
		dispatch({ type: actions.SET_IS_PLAYING, payload: true });

		scheduleRepeaterId = Tone.Transport.scheduleRepeat(
			() => checkIsEndofAudioFile(Tone.Transport.seconds, state.audioDuration),
			0.1,
			0
		);
	};

	const stopAudio = () => {
		Tone.Transport.clear(scheduleRepeaterId);
		Tone.Transport.stop();
		dispatch({ type: actions.SET_WAVEFORM_SCROLL_POSITION, payload: 0 });
		dispatch({ type: actions.SET_IS_PLAYING, payload: false });
		dispatch({
			type: actions.SET_SECONDS,
			payload: 0,
		});
	};

	const pauseAudio = () => {
		Tone.Transport.pause();
		const currentTime: number = Tone.Transport.seconds;
		dispatch({ type: actions.SET_IS_PLAYING, payload: false });
		dispatch({
			type: actions.SET_SECONDS,
			payload: currentTime,
		});
	};

	const calcTimecodeText = (seconds: number): string => {
		return `${calcMinutes(seconds)}:${calcSeconds(seconds)}:${calcMilliseconds(seconds)}`;
	};

	return (
		<Box
			justifyContent="center"
			alignItems="center"
			sx={{
				backgroundColor: theme.palette.background.default,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				gap: '10px',
				paddingBottom: '10px',
			}}
		>
			<CustomModal isOpen={isTimecodeModalOpen} setIsOpen={setIsTimecodeModalOpen}>
				<Timecode />
			</CustomModal>
			<Box>
				{state.windowWidth < 505 ? (
					<IconButton onClick={() => setIsTimecodeModalOpen(true)}>
						<AccessTimeIcon />
					</IconButton>
				) : (
					<Timecode />
				)}
			</Box>
			<Stack direction="row">
				<AudioUpload />
				<FilledIconButton
					isActive={state.isPlaying || state.seconds > 0}
					onClickHandler={stopAudio}
					icon={<StopIcon />}
				/>
				<FilledIconButton
					isActive={!state.isPlaying && state.isUploaded}
					onClickHandler={playAudio}
					icon={<PlayArrowIcon />}
				/>
				<FilledIconButton
					isActive={state.isPlaying}
					onClickHandler={pauseAudio}
					icon={<PauseIcon />}
				/>
			</Stack>
			<ZoomSlider />
			<Box
				sx={{
					display: state.windowWidth < 875 || isMobile ? 'none' : 'block',
					width: '155px',
					backgroundColor: theme.palette.common.lightBlueTrans,
					border: `1px solid ${theme.palette.common.lightBlue}`,
					borderRadius: '5px',
					textAlign: 'center',
				}}
			>
				<Typography>
					{state.selectionStartSeconds >= state.selectionEndSeconds ||
					Number.isNaN(state.selectionStartSeconds)
						? 'Selected Range'
						: `${calcTimecodeText(state.selectionStartSeconds)} —
					${calcTimecodeText(state.selectionEndSeconds)}`}
				</Typography>
			</Box>
		</Box>
	);
};

export default PlaybackControls;
