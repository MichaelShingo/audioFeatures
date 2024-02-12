import { Box } from '@mui/system';
import { ReactNode, useEffect } from 'react';
import { useMediaQuery, Theme, useTheme } from '@mui/material';
import { actions, useAppState } from '../../context/AppStateContext';

interface AppContainerProps {
	children: ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
	const { dispatch } = useAppState();
	const isSmallScreen = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
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
				height: isSmallScreen ? '95vh' : '100vh',
				width: '100vw',
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