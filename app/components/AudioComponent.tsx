import React, { ChangeEvent } from 'react';
import Meyda from 'meyda';

const AudioComponent: React.FC = () => {
	const audioContext = new window.AudioContext();
	const PITCHES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			analyzePitch(file, 'name');
		}
	};

	const getChroma = async (file: File) => {
		const arrayBuffer: ArrayBuffer = await file.arrayBuffer();
		const BUFFER_SIZE = 512;
		const audioBuffer: AudioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		Meyda.bufferSize = BUFFER_SIZE;
		Meyda.sampleRate = audioBuffer.sampleRate;
		const channelData: Float32Array = audioBuffer.getChannelData(0);
		const numFrames: number = Math.floor(channelData.length / BUFFER_SIZE);
		const results: any[] = [];
		for (let i = 0; i < numFrames; i++) {
			const start: number = i * BUFFER_SIZE;
			const end: number = start + BUFFER_SIZE;
			const frame: Float32Array = channelData.subarray(start, end);
			const chroma: number[] = Meyda.extract('chroma', frame) as number[];
			results.push(chroma);
		}
		console.log(results);
		return results;

		// console.log(audioBuffer);
		// processAudio(audioBuffer);
	};

	const getNoteIndex = (chroma: number[]) => {
		return chroma.indexOf(Math.max(...chroma));
	};

	const getNoteName = (chroma: number[]) => {
		return PITCHES[getNoteIndex(chroma)];
	};

	const analyzePitch = async (fileBuffer: File, type = 'values') => {
		const results: any[] = [];
		const chromaResults: any[] = await getChroma(fileBuffer);
		chromaResults.forEach((chroma: number[]) => {
			if (type === 'index') results.push(getNoteIndex(chroma));
			else if (type === 'name') results.push(getNoteName(chroma));
			else results.push(chroma);
		});
		console.log(results);
		return results;
	};

	const processAudio = (buffer: AudioBuffer) => {
		console.log(buffer.length, buffer.sampleRate, buffer.duration);
		Meyda.bufferSize = 512;
		const features = Meyda.extract(['rms', 'chroma'], buffer.getChannelData(0)); // Assuming mono audio
		// console.log(features);
	};

	const chunkAudioBuffer = (array: [], size: number) => {
		const chunkedArray = [];
		for (let i = 0; i < array.length; i++) {
			const last = chunkedArray[chunkedArray.length - 1];
			if (!last || last.length === size) {
				chunkedArray.push([array[i]]);
			} else {
				last.push(array[i]);
			}
		}
		return chunkedArray;
	};

	return (
		<div>
			<input type="file" accept="audio/*" onChange={handleFileChange} />
		</div>
	);
};

export default AudioComponent;

/*
https://www.reddit.com/r/webdev/comments/elyeej/how_to_pass_music_from_a_streaming_service_into/
https://stackoverflow.com/questions/70002015/streaming-into-audio-element
https://stackoverflow.com/questions/70002015/streaming-into-audio-element
https://developers.soundcloud.com/docs/api/guide
https://www.youtube.com/watch?v=MdvzlDIdQ0o
*/
