import { useTheme } from '@mui/material';
import { actions, useAppState } from '../context/AppStateContext';
import { Box } from '@mui/system';
import usePositionCalculations from '../customHooks/usePositionCalculations';

const DraggableSelection = () => {
	const { state, dispatch } = useAppState();
	const { calcPositionFromSeconds, calcSecondsFromPosition } = usePositionCalculations();
	const theme = useTheme();

	const selectionWidth: number =
		state.selectionEndPosition - state.selectionStartPosition;

	const isVisible = selectionWidth > 0;

	return (
		<Box
			sx={{
				backgroundColor: theme.palette.common.lightBlueTrans,
				display: isVisible ? 'block' : 'none',
				border: `2px solid ${theme.palette.common.lightBlue}`,
				opacity: '0.5',
				height: '100%',
				width: `${selectionWidth}px`,
				position: 'absolute',
				zIndex: '-1',
				left: state.selectionStartPosition,
			}}
		></Box>
	);
};

export default DraggableSelection;
