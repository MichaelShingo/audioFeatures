import { useEffect } from 'react';
import { actions, useAppState } from '../../context/AppStateContext';

const WindowSizeTracker: React.FC = () => {
	const { dispatch } = useAppState();

	useEffect(() => {
		dispatch({ type: actions.SET_WINDOW_HEIGHT, payload: window.innerHeight });
		dispatch({ type: actions.SET_WINDOW_WIDTH, payload: window.innerWidth });

		const handleResize = () => {
			dispatch({ type: actions.SET_WINDOW_HEIGHT, payload: window.innerHeight });
			dispatch({ type: actions.SET_WINDOW_WIDTH, payload: window.innerWidth });
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return <></>;
};

export default WindowSizeTracker;
