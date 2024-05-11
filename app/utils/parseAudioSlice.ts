export type Chord = {
	symbol: string;
	start: number;
	end: number;
};

export type AudioSlice = {
	C: number;
	'C#': number;
	D: number;
	'D#': number;
	E: number;
	F: number;
	'F#': number;
	G: number;
	'G#': number;
	A: number;
	'A#': number;
	B: number;
	start: number;
	end: number;
	series_id: number;
	chord_cluster: number;
	predicted_cluster: string;
	song: string;
};

export const parseAudioSlice = (audioSliceData: Record<string, AudioSlice>): Chord[] => {
	const audioSliceKeys: string[] = Object.keys(audioSliceData);

	const chords: Chord[] = [];
	let currentChord: Chord = {
		symbol: audioSliceData[0].predicted_cluster,
		start: audioSliceData[0].start,
		end: -1,
	};

	for (let i = 1; i < audioSliceKeys.length; i++) {
		const nextSlice: AudioSlice = audioSliceData[audioSliceKeys[i]];
		if (
			nextSlice.predicted_cluster !== currentChord.symbol ||
			i === audioSliceKeys.length - 1
		) {
			currentChord.end = nextSlice.start;
			chords.push({ ...currentChord });
			currentChord = {
				symbol: nextSlice.predicted_cluster,
				start: nextSlice.start,
				end: -1,
			};
		}
	}

	return chords;
};
