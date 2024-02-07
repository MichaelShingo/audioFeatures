import { useTheme } from '@mui/material';
import { useAppState } from '../context/AppStateContext';
import { Box } from '@mui/system';
import usePositionCalculations from '../customHooks/usePositionCalculations';

const DraggableSelection = () => {
	const { state } = useAppState();
	const { calcPositionFromSeconds } = usePositionCalculations();
	const theme = useTheme();

	const selectionWidth: number = calcPositionFromSeconds(
		state.selectionEndSeconds - state.selectionStartSeconds
	);
	const isVisible = selectionWidth > 0;

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
