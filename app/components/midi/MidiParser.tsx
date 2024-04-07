import { Midi } from '@tonejs/midi';
import { useEffect } from 'react';
import * as Tone from 'tone';
import { actions, useAppState } from '../../context/AppStateContext';
import { mapRange } from '@/app/utils/mapRange';
const synths: Tone.PolySynth[] = [];

const MidiParser = () => {
	const { state, dispatch } = useAppState();

	useEffect(() => {
		if (!state.isPlaying) {
			console.log('releasing synths');
			synths.forEach((synth) => {
				synth.releaseAll();
			});
		}
	}, [state.isPlaying]);

	useEffect(() => {
		scheduleNotes();
	}, [state.isUploading]);

	useEffect(() => {
		console.log(synths);
		synths.forEach((synth) => {
			synth.volume.value = mapRange(state.chordVolume, 0, 100, -80, 0);
		});
	}, [state.chordVolume]);

	const scheduleNotes = async () => {
		synths.length = 0;
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
