import { useEffect, useRef, useState } from 'react';
import Meyda from 'meyda';
import { Button } from '@mui/material';
import { actions, useAppState } from '../context/AppStateContext';

const AudioComponent = () => {
	const { state, dispatch } = useAppState();
	const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
	const audioElement = useRef<HTMLMediaElement | null>(null);
	
	useEffect(() => {
		setAudioContext(new AudioContext());
	}, []);

	useEffect(() => {
		if (audioContext !== null && audioElement.current !== null) {
			const source =
				audioElement && audioContext.createMediaElementSource(audioElement.current);
			source && source.connect(audioContext.destination);
			
			const SLOWEST: number =  16384;
			const FRAME_RATE: number = 8192;
			const analyzer = Meyda.createMeydaAnalyzer({
				audioContext: audioContext,
				source: source,
				bufferSize: FRAME_RATE, // 28 times per sec
				featureExtractors: ['rms'],
				callback: (features: Meyda.MeydaFeaturesObject) => {
					console.log(features);
					dispatch({type: actions.SET_RMS, payload: features.rms })
				},
			});
			analyzer.start();
		}
	}, [audioContext]);

	const startAudio = () => {
		audioContext && audioContext.state === 'suspended' ? audioContext.resume() : null;
	};
	return (
		<>
			<audio
				ref={audioElement}
				controls
				loop
				crossOrigin="anonymous"
				id="audio"
				src="/cowboyBebopSample.wav"
			></audio>
			<Button variant="outlined" onClick={startAudio}>
				Start
			</Button>
		</>
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