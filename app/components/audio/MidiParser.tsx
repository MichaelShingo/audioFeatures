import { Midi } from '@tonejs/midi';
import { useEffect } from 'react';
import * as Tone from 'tone';
import { useAppState } from '../../context/AppStateContext';
const synths: Tone.PolySynth[] = [];

const MidiParser = () => {
	const { state } = useAppState();

	useEffect(() => {
		if (state.isPlaying) {
			synths.forEach((synth) => {
				synth.volume.value = 5;
			});
		} else {
			synths.forEach((synth) => {
				synth.volume.value = -100;
			});
		}
	}, [state.isPlaying]);
	useEffect(() => {
		triggerNotes();
	}, []);

	// test multi-track midi

	const triggerNotes = async () => {
		await Tone.start();
		const midi = await Midi.fromUrl('/simpleMidi.mid');

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
