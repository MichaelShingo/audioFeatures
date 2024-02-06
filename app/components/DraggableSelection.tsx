import { useTheme } from '@mui/material';
import { actions, useAppState } from '../context/AppStateContext';
import { Box } from '@mui/system';
import usePositionCalculations from '../customHooks/usePositionCalculations';
import { useEffect, useRef } from 'react';

const DraggableSelection = () => {
	const { state, dispatch } = useAppState();
	const { calcPositionFromSeconds } = usePositionCalculations();
	const theme = useTheme();

	const prevZoomFactor = useRef<number>(state.zoomFactor);
	const selectionWidth: number = calcPositionFromSeconds(
		state.selectionEndSeconds - state.selectionStartSeconds
	);
	const isVisible = selectionWidth > 0;

	useEffect(() => {
		const zoomFactorDifference: number = state.zoomFactor - prevZoomFactor.current;

		dispatch({
			type: actions.SET_SELECTION_START_POSITION,
			payload: state.selectionStartSeconds * (zoomFactorDifference + 1),
		});
		dispatch({
			type: actions.SET_SELECTION_END_POSITION,
			payload: state.selectionEndSeconds * (zoomFactorDifference + 1),
		});
		prevZoomFactor.current = state.zoomFactor;
	}, [state.zoomFactor]);

	return (
		<Box
			sx={{
				backgroundColor: theme.palette.common.lightBlueTrans,
				visibility: isVisible ? 'visible' : 'hidden',
				border: `2px solid ${theme.palette.common.lightBlue}`,
				opacity: '0.5',
				height: '100%',
				width: `${selectionWidth}px`,
				position: 'absolute',
				zIndex: '-1',
				left: calcPositionFromSeconds(state.selectionStartSeconds),
			}}
		></Box>
	);
};

export default DraggableSelection;
