import { Box } from '@mui/system';
import React, { ReactNode } from 'react';
import { useTheme } from '@mui/material';
import { actions, useAppState } from '../context/AppStateContext';

interface DataContainerProps {
	children: ReactNode;
}
const DataContainer: React.FC<DataContainerProps> = ({ children }) => {
	const { state, dispatch } = useAppState();
	const theme = useTheme();

	const positionPercentage: number =
		100 - (state.resizePosition / state.windowHeight) * 100;
	return (
		<Box
			sx={{
				backgroundColor: theme.palette.background.default,
				height: `${positionPercentage}%`,
				width: '100%',
				padding: '1%',
				zIndex: '-1',
			}}
		>
			{children}
		</Box>
	);
};

export default DataContainer;
