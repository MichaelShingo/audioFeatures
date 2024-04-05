import React, { useEffect, useRef } from 'react';
import Meyda, { MeydaFeaturesObject } from 'meyda';
import {
	BUFFER_SIZE,
	Loudness,
	PITCH_LETTERS,
	PitchData,
	SpectralFlatness,
} from '../../data/constants';
import { actions, useAppState } from '../../context/AppStateContext';
import * as Tone from 'tone';

const AudioComponent: React.FC = () => {
	const { state, dispatch } = useAppState();
	const nativeAudioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (nativeAudioRef.current) {
			nativeAudioRef.current.play();
		}
		dispatch({ type: actions.SET_SECONDS, payload: 0 });
		Tone.Transport.seconds = 0;
		const setPitchData = async () => {
			if (state.audioFile) {
				const pitchResults: PitchData = await analyzePitch(state.audioFile);
				dispatch({ type: actions.SET_IS_UPLOADING, payload: false });
				dispatch({ type: actions.SET_IS_UPLOADED, payload: true });
				dispatch({
					type: actions.SET_PITCH_DATA,
					payload: pitchResults as PitchData,
				});
			}
		};
		setPitchData();
	}, [state.audioFile]);

	const analyzePitch = async (fileBuffer: File, type = 'values') => {
		const results: (number | string | number[])[] = [];
		const chromaResults: number[][] = await getFeatures(fileBuffer);

		for (const chroma of chromaResults) {
			if (type === 'index') {
				results.push(getNoteIndex(chroma));
			} else if (type === 'name') {
				results.push(getNoteName(chroma));
			} else {
				results.push(chroma);
			}
		}
		return results;
	};

	const getNoteIndex = (chroma: number[]) => {
		return chroma.indexOf(Math.max(...chroma));
	};

	const getNoteName = (chroma: number[]) => {
		return PITCH_LETTERS[getNoteIndex(chroma)];
	};

	const getFeatures = async (fileBuffer: File): Promise<number[][]> => {
		const audioBinaryFile: ArrayBuffer = await fileBuffer.arrayBuffer();

		if (Tone.context) {
			const audioBufferFile: AudioBuffer =
				await Tone.context.decodeAudioData(audioBinaryFile);

			dispatch({ type: actions.SET_AUDIO_DURATION, payload: audioBufferFile.duration });
			dispatch({ type: actions.SET_AUDIO_BUFFER, payload: audioBufferFile });

			Meyda.bufferSize = BUFFER_SIZE;
			Meyda.sampleRate = audioBufferFile.sampleRate;

			const waveformData: Float32Array = audioBufferFile.getChannelData(0);

			dispatch({ type: actions.SET_WAVEFORM, payload: waveformData });

			const numFrames: number = Math.floor(waveformData.length / BUFFER_SIZE);
			let chromaResults: number[][] = [];
			const loudnessResults: Loudness[] = [];
			const spectralFlatnessResults: SpectralFlatness[] = [];

			for (let i = 0; i < numFrames; i++) {
				const start: number = i * BUFFER_SIZE;
				const end: number = start + BUFFER_SIZE;
				const frame: Float32Array = waveformData.subarray(start, end);
				const features: Partial<MeydaFeaturesObject> | null = Meyda.extract(
					['chroma', 'loudness', 'spectralFlatness'],
					frame
				);

				chromaResults.push(features?.chroma as number[]);
				loudnessResults.push(features?.loudness);
				spectralFlatnessResults.push(features?.spectralFlatness);
			}
			dispatch({
				type: actions.SET_LOUDNESS_DATA,
				payload: loudnessResults,
			});

			dispatch({
				type: actions.SET_SPECTRAL_FLATNESS_DATA,
				payload: spectralFlatnessResults as SpectralFlatness[],
			});

			if (chromaResults === undefined) {
				chromaResults = [[0]];
			}
			return chromaResults;
		}
		return [[0]];
	};

	return (
		<audio ref={nativeAudioRef}>
			<source src="/silent.mp3" type="audio/mp3"></source>
		</audio>
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
