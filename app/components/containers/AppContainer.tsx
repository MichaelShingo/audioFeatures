import { Box } from '@mui/system';
import { ReactNode, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { actions, useAppState } from '../../context/AppStateContext';

interface AppContainerProps {
	children: ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
	const { dispatch } = useAppState();
	const theme = useTheme();

	useEffect(() => {
		dispatch({ type: actions.SET_WINDOW_HEIGHT, payload: window.innerHeight });
		dispatch({ type: actions.SET_WINDOW_WIDTH, payload: window.innerWidth });
		const handleResize = () => {
			dispatch({ type: actions.SET_WINDOW_HEIGHT, payload: window.innerHeight });
			dispatch({ type: actions.SET_WINDOW_WIDTH, payload: window.innerWidth });
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<Box
			data-label="app-container"
			component="div"
			sx={{
				backgroundColor: theme.palette.background.paper,
				color: 'white',
				height: '100vh',
				width: '100vw',
				overflowX: 'hidden',
				overflowY: 'auto',
				mt: '0px',
				mb: '0px',
				pt: '0%',
				pb: '0%',
				ml: '50%',
				mr: '50%',
				transform: 'translateX(-50%)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{children}
		</Box>
	);
};

export default AppContainer;
