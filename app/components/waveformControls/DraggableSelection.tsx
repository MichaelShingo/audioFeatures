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
			<DragHandle right="-7px" left={null} visible={handleVisibility} label="right" />
			<DragHandle right={null} left="-7px" visible={handleVisibility} label="left" />
		</Box>
	);
};

interface DragHandlesProps {
	right: string | null;
	left: string | null;
	visible: boolean;
	label: 'right' | 'left';
}

const DragHandle: React.FC<DragHandlesProps> = ({ right, left, visible, label }) => {
	const theme = useTheme();
	const { state, dispatch } = useAppState();
	const { calcSecondsFromPosition } = usePositionCalculations();

	useEffect(() => {
		if (!state.isDraggingSelectionHandle) {
			return;
		}
		right !== null ? console.log('dragging right') : console.log('dragging left');
		const endPosition: number = state.mousePosition.x + state.waveformScrollPosition;
		const endSeconds: number = calcSecondsFromPosition(endPosition);

		if (label === 'right') {
			// console.log('dispatch right');
			dispatch({
				type: actions.SET_SELECTION_END_SECONDS,
				payload: endSeconds,
			});
		} else {
			// console.log('dispatch left');
			dispatch({
				type: actions.SET_SELECTION_START_SECONDS,
				payload: endSeconds,
			});
		}
	}, [state.mousePosition]);

	const handleOnMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		dispatch({ type: actions.SET_IS_DRAGGING_SELECTION_HANDLE, payload: true });
		dispatch({ type: actions.SET_GLOBAL_MOUSE_UP, payload: false });
	};

	return (
		<Box
			onMouseDown={(e: React.MouseEvent) => handleOnMouseDown(e)}
			onMouseUp={() =>
				dispatch({ type: actions.SET_IS_DRAGGING_SELECTION_HANDLE, payload: false })
			}
			sx={{
				opacity: visible ? '100%' : '0%',
				transition: '0.2s ease-in-out',
				width: '12px',
				height: '12px',
				borderRadius: '50%',
				border: `1px solid ${theme.palette.common.lightBlue}`,
				backgroundColor: `${theme.palette.background.default}`,
				position: 'absolute',
				top: '50%',
				right: right,
				left: left,
				pointerEvents: 'all',
				'&:hover': {
					backgroundColor: theme.palette.common.lightBlue,
					cursor: 'ew-resize',
				},
			}}
		></Box>
	);
};

export default DraggableSelection;
