import { Midi } from '@tonejs/midi';

const useMidi = () => {
	const convertToJSON = async () => {
		const midi = await Midi.fromUrl('/simpleMidi.mid');
		console.log(midi);
		const name = midi.name;
		const tracks = [];
		midi.tracks.forEach((track) => {
			const notes = track.notes;
			notes.forEach((note) => {});
		});
		return midi;
	};
	return convertToJSON;
};

export default useMidi;
