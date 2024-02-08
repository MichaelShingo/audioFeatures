import { IconButton } from '@mui/material';
import { actions, useAppState } from '../../context/AppStateContext';
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
	useEffect(() => {
		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);

	useEffect(() => {
		if (state.isDragging) {
			dispatch({ type: actions.SET_RESIZE_POSITION, payload: state.mousePosition.y });
		}
	}, [state.mousePosition]);

	const handleOnMouseDown = (e: React.MouseEvent<Element, MouseEvent>) => {
		e.stopPropagation();
		dispatch({ type: actions.SET_IS_DRAGGING, payload: true });
	};

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
