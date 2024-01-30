import React, { useEffect } from 'react';
import { actions, useAppState } from '../context/AppStateContext';

interface MousePosition {
	x: number;
	y: number;
}

const MousePosition: React.FC = () => {
	const { dispatch } = useAppState();

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			e.stopPropagation();
			dispatch({
				type: actions.SET_MOUSE_POSITION,
				payload: { x: e.clientX, y: e.clientY },
			});
		};
		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, [dispatch]);

	return <></>;
};

export default MousePosition;
