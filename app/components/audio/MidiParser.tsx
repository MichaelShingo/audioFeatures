import { Midi } from '@tonejs/midi';
import { useEffect } from 'react';
import * as Tone from 'tone';
const MidiParser = () => {
	useEffect(() => {
		triggerNotes();
		// scheduleNotes();
	}, []);

	const triggerNotes = async () => {
		await Tone.start();
		const synths: Tone.PolySynth[] = [];
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

	const scheduleNotes = async () => {
		const synths: Tone.PolySynth[] = [];
		const now = Tone.now() + 0.5;
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
			synths.push(synth);
			track.notes.forEach((note) => {
				const startTime = Tone.Time(note.time).toSeconds();
				const duration = Tone.Time(note.duration).toSeconds();
				Tone.Transport.schedule((time) => {
					synth.triggerAttackRelease(note.name, duration, 0, note.velocity);
				}, startTime);

				console.log('start time = ', startTime);
			});
		});
		console.log(Tone.Transport);
	};
	return <></>;
};

export default MidiParser;
