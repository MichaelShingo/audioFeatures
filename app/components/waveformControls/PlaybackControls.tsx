import { actions, useAppState } from '../../context/AppStateContext';
import { Stack, Typography, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import Timecode from './Timecode';
import FilledIconButton from './FilledIconButton';
import React, { useEffect, useState } from 'react';
import AudioUpload from '../audio/AudioUpload';
import * as Tone from 'tone';
import ZoomSlider from './ZoomSlider';
import {
	calcMilliseconds,
	calcMinutes,
	calcSeconds,
} from '@/app/utils/timecodeCalculations';
import { Box } from '@mui/system';

let scheduleRepeaterId: number = -1;

const PlaybackControls: React.FC = () => {
	const { state, dispatch } = useAppState();
	const theme = useTheme();
	const [player, setPlayer] = useState<Tone.Player | null>(null);

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
			// direction={state.windowWidth < 855 ? 'column' : 'row'}
			justifyContent="center"
			alignItems="center"
			sx={{
				backgroundColor: theme.palette.background.default,
				display: 'flex',
				flexWrap: 'wrap',
				gap: '10px',
			}}
		>
			<Timecode />
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
