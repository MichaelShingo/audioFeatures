import { Midi } from '@tonejs/midi';
import { useEffect } from 'react';
import * as Tone from 'tone';
import { actions, useAppState } from '../../context/AppStateContext';
import { mapRange } from '@/app/utils/mapRange';
let synths: Tone.PolySynth[] = [];

const MidiParser = () => {
	const { state, dispatch } = useAppState();

	useEffect(() => {
		if (!state.isPlaying) {
			synths.forEach((synth) => {
				synth.releaseAll();
			});
		}
	}, [state.isPlaying]);

	useEffect(() => {
		scheduleNotes();
	}, [state.isUploading]);

	useEffect(() => {
		synths.forEach((synth) => {
			synth.volume.value = mapRange(state.chordVolume, 0, 100, -80, 0);
		});
	}, [state.chordVolume]);

	const scheduleNotes = async () => {
		synths.forEach((synth) => {
			synth.unsync();
			synth.dispose();
			synth.disconnect();
		});
		synths = [];
		await Tone.start();
		const midi: Midi = await Midi.fromUrl('/jazzTest.mid');

		dispatch({ type: actions.SET_MIDI_DATA, payload: midi });

		midi.tracks.forEach((track) => {
			const synth = new Tone.PolySynth(Tone.Synth, {
				envelope: {
					attack: 0.02,
					decay: 0.1,
					sustain: 0.3,
					release: 1,
				},
			}).toDestination();
			synth.sync();
			synths.push(synth);

			track.notes.forEach((note) => {
				synth.triggerAttackRelease(
					note.name,
					note.duration,
					note.time,
					note.velocity / 5
				);
			});
		});
	};

	return <></>;
};

export default MidiParser;
