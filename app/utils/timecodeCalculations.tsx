export type Timecode = {
	minutes: number;
	seconds: number;
	milliseconds: number;
};

export type Time = { [key in 'minutes' | 'seconds' | 'milliseconds']: number };

export const MILLISECONDS_PER_MINUTE = 60000;
export const MILLISECONDS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;

export const calcMinutes = (seconds: number): string => {
	return Math.floor(seconds / 60)
		.toString()
		.padStart(2, '0');
};

export const calcSeconds = (seconds: number): string => {
	return Math.floor(seconds % 60)
		.toString()
		.padStart(2, '0');
};

export const calcMilliseconds = (seconds: number): string => {
	return Math.round((seconds * 1000) % 1000)
		.toString()
		.padStart(3, '0');
};

export const roundSeconds = (seconds: number): number => {
	return Math.ceil(seconds * 1000) / 1000;
};
