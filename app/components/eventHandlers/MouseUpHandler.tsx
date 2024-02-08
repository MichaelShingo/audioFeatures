import { useEffect } from 'react';
import { actions, useAppState } from '../../context/AppStateContext';
const MouseUpHandler = () => {
	const { dispatch } = useAppState();

	useEffect(() => {
		const handleMouseUp = () => {
			dispatch({ type: actions.SET_GLOBAL_MOUSE_UP });
		};

		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);
	return <></>;
};

export default MouseUpHandler;
