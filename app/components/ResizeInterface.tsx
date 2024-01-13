import { IconButton } from '@mui/material';
import { actions, useAppState } from '../context/AppStateContext';
import { useEffect, useRef, useState } from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const ResizeInterface = () => {
	const { dispatch } = useAppState();
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
		<IconButton
			sx={{
				rotate: '90deg',
				':hover': {
					cursor: isDragging ? 'grabbing' : 'grab',
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
