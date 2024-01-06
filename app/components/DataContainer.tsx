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
	console.log('resizePosition', state.resizePosition);
	console.log('data percent', positionPercentage);
	return (
		<Box
			sx={{
				backgroundColor: 'green',
				height: `${positionPercentage}%`,
				width: '100%',
				overflowX: 'auto',
				overflowY: 'auto',
			}}
		>
			{children}
		</Box>
	);
};

export default DataContainer;
