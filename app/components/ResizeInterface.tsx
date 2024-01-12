import { Box } from '@mui/system';
import { useTheme } from '@mui/material';
import { actions, useAppState } from '../context/AppStateContext';
import { useEffect, useRef, useState } from 'react';

const ResizeInterface = () => {
	const { state, dispatch } = useAppState();
	const theme = useTheme();
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const dragStartRef = useRef<number>(-1);

	const handleMouseUp = (e: MouseEvent) => {
		e.stopPropagation();
		setIsDragging(false);
		dragStartRef.current = -1;
	};

	const handleMouseMove = (e: MouseEvent) => {
		e.stopPropagation();
		if (isDragging) {
			dispatch({ type: actions.SET_RESIZE_POSITION, payload: e.clientY });
		}
	};

	const handleOnMouseDown = (e: React.MouseEvent<Element, MouseEvent>) => {
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
			onMouseDown={(e) => handleOnMouseDown(e)}
			sx={{
				backgroundColor: theme.palette.grey[700],
				height: isDragging ? '2%' : '1%',
				width: '100%',
				position: 'absolute',
				top: `${state.resizePosition}px`,
				transition: 'height 0.5s ease-in',
				zIndex: 5,
				':hover': {
					cursor: isDragging ? 'grabbing' : 'grab',
					height: '2%',
				},
			}}
		></Box>
	);
};

export default ResizeInterface;
