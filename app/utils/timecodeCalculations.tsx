type Timecode = {
	minutes: number;
	seconds: number;
	milliseconds: number;
};

const MILLISECONDS_PER_MINUTE = 60000;
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;

export const calculateMilliseconds = (milliseconds: number): Timecode => {
	if (milliseconds < MILLISECONDS_PER_SECOND) {
		return { minutes: 0, seconds: 0, milliseconds: milliseconds };
	} else if (milliseconds < MILLISECONDS_PER_MINUTE) {
		return {
			minutes: 0,
			seconds: Math.round(milliseconds / MILLISECONDS_PER_SECOND),
			milliseconds: milliseconds % MILLISECONDS_PER_SECOND,
		};
	}
	return {
		minutes: Math.round(milliseconds / MILLISECONDS_PER_MINUTE),
		seconds: Math.round(milliseconds / MILLISECONDS_PER_SECOND),
		milliseconds: milliseconds % MILLISECONDS_PER_SECOND,
	};
};

export const calculateSeconds = (
	seconds: number
): { minutes: number; seconds: number } => {
	if (seconds < SECONDS_PER_MINUTE) {
		return { minutes: 0, seconds: seconds };
	}
	return {
		minutes: Math.round(seconds / SECONDS_PER_MINUTE),
		seconds: seconds % SECONDS_PER_MINUTE,
	};
};
