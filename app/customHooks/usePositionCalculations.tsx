import { WAVEFORM_PIXEL_WIDTH } from '../data/constants';
import { useAppState } from '../context/AppStateContext';

const usePositionCalculations = () => {
	const { state } = useAppState();

	const calcWavelengthLength = (): number => {
		return state.loudnessData.length / (1 / WAVEFORM_PIXEL_WIDTH);
	};

	const calcSecondsFromPosition = (currentPosition: number): number => {
		const playbackPercentage = currentPosition / calcWavelengthLength();
		return playbackPercentage * state.audioDuration;
	};

	const calcPositionFromSeconds = (currentTimeInSeconds: number): number => {
		const playbackPercentage: number = currentTimeInSeconds / state.audioDuration;
		return playbackPercentage * calcWavelengthLength();
	};

	const isPositionInCurrentView = (position: number) => {
		if (
			position >= state.waveformScrollPosition &&
			position <= state.waveformScrollPosition + state.windowWidth
		) {
			return true;
		}
		return false;
	};

	return { calcSecondsFromPosition, calcPositionFromSeconds, isPositionInCurrentView };
};

export default usePositionCalculations;
