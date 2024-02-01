import { Loudness, WAVEFORM_PIXEL_WIDTH } from '../data/constants';

const calcWavelengthLength = (loudnessData: Loudness[]): number => {
	return loudnessData.length / (1 / WAVEFORM_PIXEL_WIDTH);
};

export const calcSecondsFromPosition = (
	currentPosition: number,
	audioDuration: number,
	loudnessData: Loudness[]
): number => {
	const playbackPercentage = currentPosition / calcWavelengthLength(loudnessData);
	return playbackPercentage * audioDuration;
};

export const calcPositionFromSeconds = (
	currentTimeInSeconds: number,
	audioDuration: number,
	loudnessData: Loudness[]
): number => {
	const playbackPercentage: number = currentTimeInSeconds / audioDuration;
	return playbackPercentage * calcWavelengthLength(loudnessData);
};
