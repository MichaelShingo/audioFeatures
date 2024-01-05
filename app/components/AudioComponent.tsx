import React, { ChangeEvent, ReactNode, useState } from 'react';
import Meyda from 'meyda';
import { Box, Stack } from '@mui/system';

const AudioComponent: React.FC = () => {
	const audioContext = new window.AudioContext();
	const [waveform, setWaveForm] = useState<Float32Array>([]);
	const PITCHES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	//The minimum representable positive value (closest to zero) is approximately 1.4013e-45.
	// The maximum finite representable value is approximately 3.4028e38.
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			analyzePitch(file, 'name'); // length 1802
		}
	};

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
		console.log(results);
		return results;
	};

	const getNoteIndex = (chroma: number[]) => {
		return chroma.indexOf(Math.max(...chroma));
	};

	const getNoteName = (chroma: number[]) => {
		return PITCHES[getNoteIndex(chroma)];
	};

	const getChroma = async (fileBuffer: File) => {
		// why does chroma contain a lot of every pitch???
		const BUFFER_SIZE = 512;
		const audioBinaryFile: ArrayBuffer = await fileBuffer.arrayBuffer();
		const audioBufferFile: AudioBuffer =
			await audioContext.decodeAudioData(audioBinaryFile);

		Meyda.bufferSize = BUFFER_SIZE;
		Meyda.sampleRate = audioBufferFile.sampleRate;

		const waveformData: Float32Array = audioBufferFile.getChannelData(0);
		console.log(waveformData);

		let waveformMax = -Infinity;
		let waveformMin = Infinity;
		for (const num of waveformData) {
			if (num > waveformMax) {
				waveformMax = num;
			}
			if (num < waveformMin) {
				waveformMin = num;
			}
		}
		console.log(waveformMin, waveformMax);

		const scaleToRange = (value, min, max, newMin, newMax) => {
			return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
		};

		const scaledWaveformData: Float32Array = waveformData.map((value) =>
			scaleToRange(value, waveformMin, waveformMax, 0, 100)
		);

		console.log(scaledWaveformData);
		// console.log(Math.min(...waveformData), Math.max(...waveformData));
		setWaveForm(scaledWaveformData);
		const numFrames: number = Math.floor(waveformData.length / BUFFER_SIZE);
		const results: number[][] = [];

		for (let i = 0; i < numFrames; i++) {
			const start: number = i * BUFFER_SIZE;
			const end: number = start + BUFFER_SIZE;
			const frame: Float32Array = waveformData.subarray(start, end);
			const chroma: number[] = Meyda.extract('chroma', frame) as number[];
			results.push(chroma);
		}
		console.log(results);
		return results;
	};

	const generateWaveform = (): ReactNode[] => {
		const res: ReactNode[] = [];
		for (let i = 0; i < waveform.length; i++) {
			if (i % 1000 === 0) {
				console.log(i, waveform[i]);
				res.push(
					<Box
						sx={{ width: '0.5px', height: `${waveform[i]}px`, backgroundColor: 'blue' }}
					></Box>
				);
			}
		}
		return res;
	};

	return (
		<div>
			<Stack direction={'row'} alignItems="center">
				{waveform && generateWaveform()}
			</Stack>
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
