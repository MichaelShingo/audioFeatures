import { useEffect } from 'react';
import { actions, useAppState } from '../../context/AppStateContext';

const KeyPressHandler = () => {
	const { state, dispatch } = useAppState();
	const handleKeyboardEvent = (e: KeyboardEvent): void => {
		switch (e.key) {
			case ' ':
				dispatch({ type: actions.SET_IS_PLAYING, payload: !state.isPlaying });
				break;
			case 'ArrowRight':
				dispatch({ type: actions.SET_SECONDS, payload: state.seconds + 0.2 });
				break;
			default:
				break;
		}
	};
	useEffect(() => {
		window.addEventListener('keydown', (e: KeyboardEvent) => handleKeyboardEvent(e));
		return () => {
			window.removeEventListener('keydown', (e: KeyboardEvent) => handleKeyboardEvent(e));
		};
	}, []);
	return <></>;
};

export default KeyPressHandler;
