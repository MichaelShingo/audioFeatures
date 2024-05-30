import { Midi } from '@tonejs/midi';
import { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { actions, useAppState } from '../../context/AppStateContext';
import { mapRange } from '@/app/utils/mapRange';
let synths: Tone.PolySynth[] = [];

const streamToArrayBuffer = async (
	stream: ReadableStream<Uint8Array>
): Promise<ArrayBuffer> => {
	const reader = stream.getReader();
	const chunks: Uint8Array[] = [];

	let done: boolean | undefined = false;
	while (!done) {
		const { value, done: readerDone } = await reader.read();
		if (value) {
			chunks.push(value);
		}
		done = readerDone;
	}

	// Concatenate all chunks into a single Uint8Array
	const length = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
	const result = new Uint8Array(length);
	let offset = 0;
	for (const chunk of chunks) {
		result.set(chunk, offset);
		offset += chunk.length;
	}

	return result.buffer;
};

const MidiParser = () => {
	const { state, dispatch } = useAppState();
	const [midi, setMidi] = useState<Midi | null>(null);

	useEffect(() => {
		const loadMidiFromStream = async (
			stream: ReadableStream<Uint8Array>
		): Promise<Midi> => {
			const arrayBuffer = await streamToArrayBuffer(stream);
			const midi = new Midi(arrayBuffer);
			setMidi(midi);
			return midi;
		};

		if (state.midiFile) {
			loadMidiFromStream(state.midiFile);
		}
	}, [state.midiFile]);

	useEffect(() => {
		if (!state.isPlaying) {
			synths.forEach((synth) => {
				synth.releaseAll();
			});
		}
	}, [state.isPlaying]);

	useEffect(() => {
		if (!midi) {
			return;
		}
		const scheduleNotes = async () => {
			synths.forEach((synth) => {
				synth.unsync();
				synth.dispose();
				synth.disconnect();
			});
			synths = [];
			await Tone.start();

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

		scheduleNotes();
	}, [midi]);

	useEffect(() => {
		synths.forEach((synth) => {
			synth.volume.value = mapRange(state.chordVolume, 0, 100, -80, 0);
		});
	}, [state.chordVolume]);

	return <></>;
};

export default MidiParser;
