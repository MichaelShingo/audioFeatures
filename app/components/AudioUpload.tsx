import React, { ChangeEvent } from 'react';
import { actions, useAppState } from '../context/AppStateContext';

const AudioUpload: React.FC = () => {
	const { dispatch } = useAppState();

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			dispatch({ type: actions.SET_AUDIO_FILE, payload: file });
		}
	};

	return <input type="file" accept="audio/*" onChange={handleFileChange} />;
};

export default AudioUpload;
