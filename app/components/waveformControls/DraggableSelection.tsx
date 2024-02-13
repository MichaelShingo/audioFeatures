import { useTheme } from '@mui/material';
import { actions, useAppState } from '../../context/AppStateContext';
import { Box } from '@mui/system';
import usePositionCalculations from '../../customHooks/usePositionCalculations';
import { useEffect, useState } from 'react';

const DraggableSelection = () => {
	const { state, dispatch } = useAppState();
	const { calcPositionFromSeconds, calcSecondsFromPosition } = usePositionCalculations();
	const theme = useTheme();
	const [handleVisibility, setHandleVisibility] = useState<boolean>(false);

	const selectionWidth: number = calcPositionFromSeconds(
		state.selectionEndSeconds - state.selectionStartSeconds
	);

	const isVisible = selectionWidth > 0;

	const handleOnMouseDownRight = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		dispatch({ type: actions.SET_IS_DRAGGING_SELECTION_HANDLE_RIGHT, payload: true });
	};

	const handleOnMouseDownLeft = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		dispatch({ type: actions.SET_IS_DRAGGING_SELECTION_HANDLE_LEFT, payload: true });
	};

	useEffect(() => {
		if (!state.isDraggingSelectionHandleRight && !state.isDraggingSelectionHandleLeft) {
			return;
		}

		const position: number = state.mousePosition.x + state.waveformScrollPosition;
		const seconds: number = calcSecondsFromPosition(position);

		if (state.isDraggingSelectionHandleRight) {
			dispatch({
				type: actions.SET_SELECTION_END_SECONDS,
				payload: seconds,
			});
		} else if (state.isDraggingSelectionHandleLeft) {
			dispatch({
				type: actions.SET_SELECTION_START_SECONDS,
				payload: seconds,
			});
		}
	}, [state.mousePosition]);

	const handleStyles = {
		opacity: handleVisibility ? '100%' : '0%',
		transition: '0.2s ease-in-out',
		width: '12px',
		height: '24px',
		border: `1px solid ${theme.palette.common.lightBlue}`,
		backgroundColor: `${theme.palette.background.default}`,
		position: 'absolute',
		top: '50.8%',
		pointerEvents: 'all',
		'&:hover': {
			backgroundColor: theme.palette.common.lightBlue,
			cursor: 'ew-resize',
		},
	};

	return (
		<Box
			onMouseOver={() => setHandleVisibility(true)}
			onMouseOut={() => setHandleVisibility(false)}
			sx={{
				backgroundColor: theme.palette.common.lightBlueTrans,
				visibility: isVisible ? 'visible' : 'hidden',
				border: `2px solid ${theme.palette.common.lightBlue}`,
				opacity: '0.5',
				height: '100%',
				width: `${selectionWidth}px`,
				position: 'absolute',
				zIndex: '1',
				left: calcPositionFromSeconds(state.selectionStartSeconds),
				pointerEvents: 'all',
			}}
		>
			<Box
				onMouseDown={(e: React.MouseEvent) => handleOnMouseDownLeft(e)}
				onMouseUp={() => {
					dispatch({
						type: actions.SET_IS_DRAGGING_SELECTION_HANDLE_LEFT,
						payload: false,
					});
				}}
				sx={{
					...handleStyles,
					left: '-7px',
				}}
			></Box>
			<Box
				onMouseDown={(e: React.MouseEvent) => handleOnMouseDownRight(e)}
				onMouseUp={() => {
					dispatch({
						type: actions.SET_IS_DRAGGING_SELECTION_HANDLE_RIGHT,
						payload: false,
					});
				}}
				sx={{
					...handleStyles,
					right: '-7px',
				}}
			></Box>
		</Box>
	);
};

export default DraggableSelection;
