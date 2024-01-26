import { IconButton } from '@mui/material';
import { actions, useAppState } from '../context/AppStateContext';
import { useEffect, useRef } from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const ResizeInterface = () => {
	const { state, dispatch } = useAppState();
	const dragStartRef = useRef<number>(-1);

	const handleMouseUp = (e: MouseEvent) => {
		e.stopPropagation();
		dispatch({ type: actions.SET_IS_DRAGGING, payload: false });
		dragStartRef.current = -1;
	};

	const handleMouseMove = (e: MouseEvent) => {
		e.stopPropagation();
		if (state.isDragging) {
			dispatch({ type: actions.SET_RESIZE_POSITION, payload: e.clientY });
		}
	};

	const handleOnMouseDown = (e: React.MouseEvent<Element, MouseEvent>) => {
		e.stopPropagation();
		dispatch({ type: actions.SET_IS_DRAGGING, payload: true });
	};

	useEffect(() => {
		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, [state.isDragging]);

	useEffect(() => {
		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return (
		<IconButton
			sx={{
				rotate: '90deg',
				':hover': {
					cursor: state.isDragging ? 'grabbing' : 'grab',
					height: '2%',
				},
			}}
			onMouseDown={(e) => handleOnMouseDown(e)}
		>
			<DragIndicatorIcon />
		</IconButton>
	);
};

export default ResizeInterface;
