import React, { useEffect } from 'react';
import Meyda from 'meyda';
import { BUFFER_SIZE, PITCH_LETTERS } from '../data/constants';
import { actions, useAppState } from '../context/AppStateContext';

const AudioComponent: React.FC = () => {
	const { state, dispatch } = useAppState();
	const audioContext = new window.AudioContext();

	useEffect(() => {
		if (state.audioFile) {
			analyzePitch(state.audioFile);
		}
	}, [state.audioFile]);

	const analyzePitch = async (fileBuffer: File, type = 'values') => {
		const results: (number | string | number[])[] = [];
		const chromaResults: number[][] = await getChroma(fileBuffer);

		for (const chroma of chromaResults) {
			if (type === 'index') {
				results.push(getNoteIndex(chroma));
			} else if (type === 'name') {
				results.push(getNoteName(chroma));
			} else {
				results.push(chroma);
			}
		}
		// console.log(results);
		return results;
	};

	const getNoteIndex = (chroma: number[]) => {
		return chroma.indexOf(Math.max(...chroma));
	};

	const getNoteName = (chroma: number[]) => {
		return PITCH_LETTERS[getNoteIndex(chroma)];
	};

	const getChroma = async (fileBuffer: File) => {
		const audioBinaryFile: ArrayBuffer = await fileBuffer.arrayBuffer();
		const audioBufferFile: AudioBuffer =
			await audioContext.decodeAudioData(audioBinaryFile);

		Meyda.bufferSize = BUFFER_SIZE;
		Meyda.sampleRate = audioBufferFile.sampleRate;

		const waveformData: Float32Array = audioBufferFile.getChannelData(0);
		// console.log(waveformData);

		dispatch({ type: actions.SET_WAVEFORM, payload: waveformData });

		const numFrames: number = Math.floor(waveformData.length / BUFFER_SIZE);
		const results: number[][] = [];

		for (let i = 0; i < numFrames; i++) {
			const start: number = i * BUFFER_SIZE;
			const end: number = start + BUFFER_SIZE;
			const frame: Float32Array = waveformData.subarray(start, end);
			const chroma: number[] = Meyda.extract('chroma', frame) as number[];
			results.push(chroma);
		}
		// console.log(results);
		return results;
	};

	return <></>;
};

export default AudioComponent;

/*
https://www.reddit.com/r/webdev/comments/elyeej/how_to_pass_music_from_a_streaming_service_into/
https://stackoverflow.com/questions/70002015/streaming-into-audio-element
https://stackoverflow.com/questions/70002015/streaming-into-audio-element
https://developers.soundcloud.com/docs/api/guide
https://www.youtube.com/watch?v=MdvzlDIdQ0o
*/
