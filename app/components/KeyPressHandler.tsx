import { useEffect } from 'react';
import { actions, useAppState } from '../context/AppStateContext';

const KeyPressHandler: React.FC = () => {
	const { state, dispatch } = useAppState();

	const handleKeyPress = (event: KeyboardEvent): void => {
		if (event.key === 'd') {
			dispatch({ type: actions.DRONE_ON });
		} else if (event.key >= '1' && event.key <= '9') {
			dispatch({ type: actions.BEAT_MAP, payload: parseInt(event.key) - 1 });
		} else if (event.shiftKey && event.key === 'ArrowUp') {
			dispatch({ type: actions.INCREASE_OCTAVE });
		} else if (event.shiftKey && event.key === 'ArrowDown') {
			dispatch({ type: actions.DECREASE_OCTAVE });
		} else if (event.shiftKey && event.key === 'ArrowRight') {
			dispatch({ type: actions.INCREASE_BEATS });
		} else if (event.shiftKey && event.key === 'ArrowLeft') {
			dispatch({ type: actions.DECREASE_BEATS });
		} else if (event.ctrlKey && event.key === 'ArrowUp') {
			dispatch({ type: actions.POLYRHYTHM, payload: parseInt(state.polyrhythm) + 1 });
		} else if (event.ctrlKey && event.key === 'ArrowDown') {
			dispatch({ type: actions.POLYRHYTHM, payload: parseInt(state.polyrhythm) - 1 });
		} else if (event.key === 'ArrowRight') {
			dispatch({ type: actions.INCREASE_TEMPO });
		} else if (event.key === 'ArrowLeft') {
			dispatch({ type: actions.DECREASE_TEMPO });
		} else if (event.key === 'p') {
			dispatch({ type: actions.METRO_ON });
		} else if (event.key === 'ArrowUp') {
			dispatch({ type: actions.INCREASE_PITCH });
		} else if (event.key === 'ArrowDown') {
			dispatch({ type: actions.DECREASE_PITCH });
		} else if (event.key === 's') {
			dispatch({ type: actions.SETTINGS_OPEN });
		} else if (event.key === 'f') {
			dispatch({ type: actions.TOGGLE_FLASH });
		}
	};

	const handleResize = () => {
		dispatch({ type: actions.SET_WIN_WIDTH, payload: window.innerWidth });
		dispatch({ type: actions.SET_WIN_HEIGHT, payload: window.innerHeight });
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
			window.removeEventListener('resize', handleResize);
		};
	});

	return <></>;
};

export default KeyPressHandler;
