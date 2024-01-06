import { Box } from '@mui/system';
import { useTheme } from '@mui/material';
import { actions, useAppState } from '../context/AppStateContext';
import { useEffect, useRef, useState } from 'react';

const ResizeInterface = () => {
	const { state, dispatch } = useAppState();
	const theme = useTheme();
	const [mouseY, setMouseY] = useState<number>(0);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const dragStartRef = useRef<number>(-1);

	const handleMouseUp = () => {
		setIsDragging(false);
		dragStartRef.current = -1;
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (isDragging) {
			dispatch({ type: actions.SET_RESIZE_POSITION, payload: e.clientY });
			setMouseY(e.clientY);
		}
	};

	const handleOnMouseDown = (e: MouseEvent) => {
		e.stopPropagation();
		setIsDragging(true);
	};

	useEffect(() => {
		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, [isDragging]);

	useEffect(() => {
		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return (
		<Box
			onMouseDown={handleOnMouseDown}
			sx={{
				backgroundColor: theme.palette.grey[50],
				height: '2%',
				width: '100%',
				position: 'absolute',
				top: `${state.resizePosition}px`,
				zIndex: 5,
				':hover': {
					cursor: isDragging ? 'grabbing' : 'grab',
				},
			}}
		></Box>
	);
};

export default ResizeInterface;
