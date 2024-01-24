export const BUFFER_SIZE: number = 512;
export const PITCH_LETTERS = [
	'C',
	'C#',
	'D',
	'D#',
	'E',
	'F',
	'F#',
	'G',
	'G#',
	'A',
	'A#',
	'B',
];

export const WAVEFORM_PIXEL_WIDTH: number = 0.5;

export type PitchData = (number | string | number[])[];
export type Loudness = { specific: Float32Array; total: number } | undefined;
export type SpectralFlatness = number | undefined;
