import { Loudness, WAVEFORM_PIXEL_WIDTH } from '../data/constants';

export const calcSecondsFromPosition = (
	currentPosition: number,
	audioDuration: number,
	loudnessData: Loudness[]
): number => {
	const wavelengthLength: number = loudnessData.length / (1 / WAVEFORM_PIXEL_WIDTH);
	const playbackPercentage = currentPosition / wavelengthLength;
	return playbackPercentage * audioDuration;
};
