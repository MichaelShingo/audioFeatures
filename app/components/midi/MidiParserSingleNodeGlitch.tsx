import { Midi } from '@tonejs/midi';
import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { actions, useAppState } from '../../context/AppStateContext';
import { mapRange } from '@/app/utils/mapRange';

const MidiParser = () => {
	const { state, dispatch } = useAppState();
	const polySynth = useRef<Tone.PolySynth>(new Tone.PolySynth());

	useEffect(() => {
		if (!state.isPlaying) {
			polySynth.current.releaseAll();
		}
	}, [state.isPlaying]);

	useEffect(() => {
		if (state.isUploaded) {
			scheduleNotes(); // this is running 4 times
		}
	}, [state.isUploaded]);

	useEffect(() => {
		// console.log(synth);
		if (polySynth) {
			polySynth.current.volume.value = mapRange(state.chordVolume, 0, 100, -120, 0);
		}
	}, [state.chordVolume]);

	const scheduleNotes = async () => {
		console.log('schedulenotes');
		await Tone.start();
		polySynth.current.unsync();
		polySynth.current.dispose();
		polySynth.current.disconnect();
		const midi: Midi = await Midi.fromUrl('/jazzTest.mid');

		dispatch({ type: actions.SET_MIDI_DATA, payload: midi });

		polySynth.current = new Tone.PolySynth(Tone.Synth, {
			envelope: {
				attack: 0.02,
				decay: 0.1,
				sustain: 0.3,
				release: 0.1,
			},
		});
		polySynth.current.toDestination();

		polySynth.current.sync();
		midi.tracks[0].notes.forEach((note) => {
			polySynth.current.triggerAttackRelease(
				note.name,
				note.duration,
				note.time,
				note.velocity / 5
			);
		});
	};

	return <></>;
};

export default MidiParser;
